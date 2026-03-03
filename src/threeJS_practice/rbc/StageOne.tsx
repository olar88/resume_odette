"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StageOneProps {
  isActive: boolean;
}

export function StageOne({ isActive }: StageOneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Track animation progress: 0 = nucleus inside, 1 = nucleus ejected
  const progressRef = useRef(0);
  const [nucleusGone, setNucleusGone] = useState(false);

  useEffect(() => {
    if (isActive) {
      progressRef.current = 0;
      setNucleusGone(false);
    }
  }, [isActive]);

  useFrame((_, delta) => {
    if (!groupRef.current || !nucleusRef.current || !outerRef.current) return;

    // Gentle bob for the whole group
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05;

    if (!isActive) return;

    // Advance ejection animation
    if (progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 0.35);
    }

    const p = progressRef.current;

    // Nucleus shrinks and moves outward
    const nucleusScale = Math.max(0, 1 - p);
    nucleusRef.current.scale.setScalar(nucleusScale);
    nucleusRef.current.position.set(p * 1.6, 0, 0);

    if (p >= 1 && !nucleusGone) {
      setNucleusGone(true);
    }

    // Outer cell slightly collapses as nucleus leaves (reticulocyte deformation)
    const outerScale = 1 - p * 0.15;
    outerRef.current.scale.set(outerScale, outerScale * (1 - p * 0.12), outerScale);
  });

  return (
    <group ref={groupRef}>
      {/* Outer cell membrane - translucent jelly sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#cc3344"
          transmission={0.75}
          opacity={0.85}
          transparent
          roughness={0.08}
          metalness={0}
          thickness={1.2}
          ior={1.35}
          attenuationColor="#cc1122"
          attenuationDistance={2}
        />
      </mesh>

      {/* Inner nucleus - dark solid sphere */}
      {!nucleusGone && (
        <mesh ref={nucleusRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#1a0a0a"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* Subtle inner glow layer */}
      <mesh>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff2244"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.2}
          emissive="#aa1122"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
