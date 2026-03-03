"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 220;

interface StageFiveProps {
  isActive: boolean;
}

export function StageFive({ isActive }: StageFiveProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);
  const phaseRef = useRef<"whole" | "shattering" | "particles" | "fading">("whole");
  const shatterProgressRef = useRef(0);
  const opacity = useRef(1);

  useEffect(() => {
    if (isActive) {
      timeRef.current = 0;
      shatterProgressRef.current = 0;
      phaseRef.current = "whole";
      opacity.current = 1;
      if (meshRef.current) {
        meshRef.current.visible = true;
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.opacity = 1;
      }
    }
  }, [isActive]);

  // Pre-compute particle initial positions (on sphere surface) and velocities
  const { positions, velocities } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 0.2;
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
      // Velocities: outward + slight random
      velocities.push(
        new THREE.Vector3(
          positions[i].x * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.3,
          positions[i].y * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.3,
          positions[i].z * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.3
        )
      );
    }
    return { positions, velocities };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!isActive) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Phase 0: whole RBC (slow, stuck rotation 0-2s)
    if (t < 2) {
      phaseRef.current = "whole";
      if (meshRef.current) {
        meshRef.current.visible = true;
        meshRef.current.rotation.y += delta * 0.05;
        meshRef.current.position.y = Math.sin(t * 0.4) * 0.02;
      }
      return;
    }

    // Phase 1: shattering (2-3.5s)
    if (t < 3.5) {
      phaseRef.current = "shattering";
      shatterProgressRef.current = Math.min(1, (t - 2) / 1.5);
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.max(0, 1 - shatterProgressRef.current * 2);
        if (mat.opacity <= 0) meshRef.current.visible = false;
      }
    } else {
      phaseRef.current = "particles";
      if (meshRef.current) meshRef.current.visible = false;
    }

    if (!instancedRef.current) return;

    const p = Math.max(0, t - 2);
    const fade = Math.max(0, 1 - Math.max(0, t - 4) / 2.5);

    // Interpolate color: dark red → yellow-brown (bilirubin)
    const colorT = Math.min(1, Math.max(0, (t - 2) / 4));
    const startColor = new THREE.Color("#7a1520");
    const endColor = new THREE.Color("#c87030");
    const currentColor = startColor.clone().lerp(endColor, colorT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(
        positions[i].x + velocities[i].x * p,
        positions[i].y + velocities[i].y * p,
        positions[i].z + velocities[i].z * p
      );
      const s = fade * (0.06 + Math.random() * 0.02);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
      instancedRef.current.setColorAt(i, currentColor);
    }

    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.instanceColor)
      instancedRef.current.instanceColor.needsUpdate = true;

    // Fade out the whole instanced mesh
    const mat = instancedRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = fade;
    if (fade <= 0.01) instancedRef.current.visible = false;
  });

  return (
    <group>
      {/* Whole old RBC (spheroid, rough) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#7a1520"
          roughness={0.88}
          metalness={0}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Particle fragments */}
      <instancedMesh ref={instancedRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          roughness={0.7}
          metalness={0}
          transparent
          opacity={1}
        />
      </instancedMesh>
    </group>
  );
}
