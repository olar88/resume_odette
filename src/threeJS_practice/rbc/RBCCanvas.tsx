"use client";
import { Canvas } from "@react-three/fiber";
import { BloodVesselScene } from "./BloodVesselScene";

interface RBCCanvasProps {
  stage: number;
  oxygenated: boolean;
}

export default function RBCCanvas({ stage, oxygenated }: RBCCanvasProps) {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#F2C78A"]} />
        <fog attach="fog" args={["#E0F7FA", 4, 14]} />
        <BloodVesselScene stage={stage} oxygenated={oxygenated} />
      </Canvas>
    </div>
  );
}
