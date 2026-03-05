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

// 血管場景的屬性介面
interface BloodVesselSceneProps {
  stage: number;        // 紅血球生命週期階段（1-5）
  oxygenated: boolean;  // 是否攜氧（僅影響階段3）
}

/**
 * 血管隧道組件
 * 創建一個具有程序化紋理的管狀血管，模擬血管內壁
 * @param narrow - 是否為狹窄血管（階段5時血管會變窄）
 */
function BloodTunnel({ narrow }: { narrow: boolean }) {
  // 材質和紋理偏移的引用
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const offsetRef = useRef(0);

  // 每幀更新紋理偏移，創造血液流動效果
  useFrame((_, delta) => {
    offsetRef.current -= delta * 0.18;  // 向後移動紋理
    if (matRef.current) {
      matRef.current.map!.offset.set(offsetRef.current, 0);
    }
  });

  // 使用程序化生成血管內壁條紋紋理
  const texture = (() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // 基礎淺米色背景
    ctx.fillStyle = "#F5E6D3";
    ctx.fillRect(0, 0, size, size);

    // 繪製水平條紋（模擬血管壁紋理）
    for (let y = 0; y < size; y += 18) {
      const alpha = 0.08 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(208, 153, 57, ${alpha})`;
      ctx.fillRect(0, y, size, 6 + Math.random() * 8);
    }
    // 繪製垂直噪點線條
    for (let x = 0; x < size; x += 32) {
      ctx.fillStyle = `rgba(180, 140, 80, 0.12)`;
      ctx.fillRect(x, 0, 2, size);
    }

    // 創建紋理並設置重複模式
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;  // 水平方向重複
    tex.wrapT = THREE.RepeatWrapping;  // 垂直方向重複
    tex.repeat.set(4, 1);              // 水平方向重複4次
    return tex;
  })();

  // 定義管道路徑：基本筆直但帶有輕微彎曲
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(0.2, 0, 5),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.2, 0, -5),
    new THREE.Vector3(0, 0, -10),
  ]);

  // 根據是否為狹窄狀態設定血管半徑（階段5時變窄）
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

/**
 * 跟隨動畫的點光源組件
 * 創造動態光影效果，模擬血液流動時的光線變化
 */
function PointLightFollower() {
  const lightRef = useRef<THREE.PointLight>(null);
  // 每幀更新光源位置，創造圓周運動效果
  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.set(
      Math.sin(state.clock.elapsedTime * 0.4) * 0.5,  // X軸正弦運動
      1.2,                                             // Y軸固定高度
      Math.cos(state.clock.elapsedTime * 0.3) * 0.5   // Z軸餘弦運動
    );
  });
  return (
    <pointLight
      ref={lightRef}
      color="#D48683"  // 粉紅色調
      intensity={6}
      distance={8}
      decay={2}
    />
  );
}

/**
 * 血管場景主組件
 * 根據階段渲染不同生命週期的紅血球
 */
export function BloodVesselScene({ stage, oxygenated }: BloodVesselSceneProps) {
  return (
    <>
      {/* 光照設置 */}
      <ambientLight color="#E0F7FA" intensity={1.8} />  {/* 環境光：淡青色 */}
      <PointLightFollower />  {/* 動態跟隨光源 */}
      <pointLight color="#D48683" intensity={3.5} position={[0, 0, 3]} distance={10} decay={2} />  {/* 前方點光源 */}
      <pointLight color="#61949A" intensity={1.8} position={[0, 0, -3]} distance={10} decay={2} />  {/* 後方點光源 */}

      {/* 血管隧道 - 階段5時變窄 */}
      <BloodTunnel narrow={stage === 5} />

      {/* 相機控制器：允許旋轉和縮放，禁用平移 */}
      <OrbitControls
        makeDefault
        minDistance={2}      // 最小縮放距離
        maxDistance={5.5}    // 最大縮放距離
        enablePan={false}    // 禁用平移
        autoRotate={false}   // 禁用自動旋轉
      />

      {/* 根據階段渲染對應的紅血球 */}
      {stage === 1 && <StageOne isActive />}                   {/* 階段1：核紅血球排出細胞核 */}
      {stage === 2 && <StageTwo />}                            {/* 階段2：成熟雙凹盤狀紅血球 */}
      {stage === 3 && <StageThree oxygenated={oxygenated} />}  {/* 階段3：攜氧/去氧狀態 */}
      {stage === 4 && <StageFour />}                           {/* 階段4：老化紅血球 */}
      {stage === 5 && <StageFive isActive />}                  {/* 階段5：紅血球破裂分解 */}
    </>
  );
}
