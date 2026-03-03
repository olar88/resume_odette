"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simplex-like noise for surface roughness
function pseudoNoise(x: number, y: number, z: number): number {
  const dot = x * 127.1 + y * 311.7 + z * 74.3;
  return (Math.sin(dot) * 43758.5453) % 1;
}

export function StageFour() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Build deformed sphere (spheroid-like, rigid)
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const pos = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Add bumpy noise displacement
      const noise =
        pseudoNoise(x * 2.1, y * 2.1, z * 2.1) * 0.12 +
        pseudoNoise(x * 5.3, y * 5.3, z * 5.3) * 0.05;

      const len = Math.sqrt(x * x + y * y + z * z);
      const scale = (len + noise) / len;
      pos.setXYZ(i, x * scale, y * scale * 0.88, z * scale); // slight vertical flatten
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Slow, lethargic movement
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.04;
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.02;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#7a1520"
        roughness={0.85}
        metalness={0.0}
        emissive="#1a0305"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}
