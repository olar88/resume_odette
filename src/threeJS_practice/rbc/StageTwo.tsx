"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function StageTwo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Build biconcave disc geometry by modifying sphere vertices
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const originalY = new Float32Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Radial distance in XZ plane
      const r = Math.sqrt(x * x + z * z);

      // Biconcave profile: compress Y towards center based on XZ radius
      // Uses a classic biconcave equation: y' = y * (a + b*r^2 + c*r^4)
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
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Gentle vertical bob
    meshRef.current.position.y = Math.sin(t * 1.1) * 0.08;
    // Slow rotation
    meshRef.current.rotation.y += delta * 0.25;
    // Slight wobble tilt
    meshRef.current.rotation.z = Math.sin(t * 0.9) * 0.06;
    meshRef.current.rotation.x = Math.cos(t * 0.7) * 0.04;

    // Wobble deformation (jelly effect)
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
        color="#cc2233"
        roughness={0.25}
        metalness={0.05}
        emissive="#660011"
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}
