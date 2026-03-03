"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StageThreeProps {
  oxygenated: boolean;
}

const OXY_COLOR = new THREE.Color("#e8152a");   // bright arterial red
const DEOXY_COLOR = new THREE.Color("#5a0a10");  // dark venous / deoxygenated red (NOT blue)

export function StageThree({ oxygenated }: StageThreeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const timeRef = useRef(0);
  const lerpColor = useRef(new THREE.Color(OXY_COLOR));

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const originalY = new Float32Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      const profile = 0.28 + 1.1 * r * r - 0.9 * r * r * r * r;
      const newY = y * profile * 0.75;
      pos.setY(i, newY);
      originalY[i] = newY;
    }

    geo.setAttribute("originalY", new THREE.BufferAttribute(originalY, 1));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Smooth color lerp
    const target = oxygenated ? OXY_COLOR : DEOXY_COLOR;
    lerpColor.current.lerp(target, delta * 3);
    matRef.current.color.copy(lerpColor.current);
    matRef.current.emissive.copy(lerpColor.current).multiplyScalar(0.15);
    matRef.current.roughness = oxygenated
      ? THREE.MathUtils.lerp(matRef.current.roughness, 0.2, delta * 3)
      : THREE.MathUtils.lerp(matRef.current.roughness, 0.55, delta * 3);
    matRef.current.metalness = oxygenated
      ? THREE.MathUtils.lerp(matRef.current.metalness, 0.12, delta * 3)
      : THREE.MathUtils.lerp(matRef.current.metalness, 0.02, delta * 3);

    // Bob & wobble
    meshRef.current.position.y = Math.sin(t * 1.1) * 0.08;
    meshRef.current.rotation.y += delta * 0.25;

    // Wobble deformation
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const origY = meshRef.current.geometry.attributes.originalY as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const base = origY.getX(i);
      const wobble = Math.sin(t * 2.5 + x * 3.5 + z * 2.0) * 0.03;
      pos.setY(i, base + wobble);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={matRef}
        color={OXY_COLOR}
        roughness={0.2}
        metalness={0.12}
        emissive="#330005"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}
