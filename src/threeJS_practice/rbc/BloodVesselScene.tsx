"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { StageOne } from "./StageOne";
import { StageTwo } from "./StageTwo";
import { StageThree } from "./StageThree";
import { StageFour } from "./StageFour";
import { StageFive } from "./StageFive";

interface BloodVesselSceneProps {
  stage: number;
  oxygenated: boolean;
}

function BloodTunnel({ narrow }: { narrow: boolean }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const offsetRef = useRef(0);

  useFrame((_, delta) => {
    offsetRef.current -= delta * 0.18;
    if (matRef.current) {
      matRef.current.map!.offset.set(offsetRef.current, 0);
    }
  });

  // Procedural stripe texture for tunnel walls
  const texture = (() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base light beige
    ctx.fillStyle = "#F5E6D3";
    ctx.fillRect(0, 0, size, size);

    // Horizontal stripes (vessel wall texture)
    for (let y = 0; y < size; y += 18) {
      const alpha = 0.08 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(208, 153, 57, ${alpha})`;
      ctx.fillRect(0, y, size, 6 + Math.random() * 8);
    }
    // Vertical noise lines
    for (let x = 0; x < size; x += 32) {
      ctx.fillStyle = `rgba(180, 140, 80, 0.12)`;
      ctx.fillRect(x, 0, 2, size);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    return tex;
  })();

  // Tube path: straight with slight curve
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(0.2, 0, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.2, 0, -5),
    new THREE.Vector3(0, 0, -10),
  ]);

  const radius = narrow ? 1.55 : 2.2;

  return (
    <mesh>
      <tubeGeometry args={[path, 80, radius, 16, false]} />
      <meshStandardMaterial
        ref={matRef}
        map={texture}
        color="#D09939"
        side={THREE.BackSide}
        roughness={0.7}
        metalness={0}
        emissive="#D48683"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function PointLightFollower() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.set(
      Math.sin(state.clock.elapsedTime * 0.4) * 0.5,
      1.2,
      Math.cos(state.clock.elapsedTime * 0.3) * 0.5
    );
  });
  return (
    <pointLight
      ref={lightRef}
      color="#D48683"
      intensity={6}
      distance={8}
      decay={2}
    />
  );
}

export function BloodVesselScene({ stage, oxygenated }: BloodVesselSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight color="#E0F7FA" intensity={1.8} />
      <PointLightFollower />
      <pointLight color="#D48683" intensity={3.5} position={[0, 0, 3]} distance={10} decay={2} />
      <pointLight color="#61949A" intensity={1.8} position={[0, 0, -3]} distance={10} decay={2} />

      {/* Blood vessel tunnel — narrows at stage 5 */}
      <BloodTunnel narrow={stage === 5} />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        minDistance={2}
        maxDistance={5.5}
        enablePan={false}
        autoRotate={false}
      />

      {/* RBC at stage */}
      {stage === 1 && <StageOne isActive />}
      {stage === 2 && <StageTwo />}
      {stage === 3 && <StageThree oxygenated={oxygenated} />}
      {stage === 4 && <StageFour />}
      {stage === 5 && <StageFive isActive />}
    </>
  );
}
