"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 220;  // 碎片粒子數量

interface StageFiveProps {
  isActive: boolean;  // 是否啟動破裂動畫
}

/**
 * 階段五：紅血球破裂與分解
 * 模擬老化紅血球在脾臟中被破壞的過程
 * 動畫分為四個階段：
 * 1. whole（完整）：0-2秒，緩慢旋轉
 * 2. shattering（破裂中）：2-3.5秒，開始破碎
 * 3. particles（粒子擴散）：3.5秒後，碎片向外飛散
 * 4. fading（消散）：4秒後，粒子淡出並變色
 */
export function StageFive({ isActive }: StageFiveProps) {
  const meshRef = useRef<THREE.Mesh>(null);                    // 完整紅血球網格引用
  const instancedRef = useRef<THREE.InstancedMesh>(null);      // 粒子實例化網格引用
  const timeRef = useRef(0);                                    // 時間累積器
  const phaseRef = useRef<"whole" | "shattering" | "particles" | "fading">("whole");  // 當前動畫階段
  const shatterProgressRef = useRef(0);                        // 破裂進度（0-1）
  const opacity = useRef(1);                                    // 不透明度

  // 當 isActive 變化時重置所有動畫狀態
  useEffect(() => {
    if (isActive) {
      timeRef.current = 0;
      shatterProgressRef.current = 0;
      phaseRef.current = "whole";  // 重置為完整狀態
      opacity.current = 1;
      if (meshRef.current) {
        meshRef.current.visible = true;
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.opacity = 1;
      }
    }
  }, [isActive]);

  // 預先計算粒子初始位置（球體表面）和速度向量
  const { positions, velocities } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 使用球面座標均勻分佈粒子
      const phi = Math.acos(2 * Math.random() - 1);    // 極角（0 到 π）
      const theta = Math.random() * Math.PI * 2;       // 方位角（0 到 2π）
      const r = 0.8 + Math.random() * 0.2;             // 半徑略有變化
      
      // 將球面座標轉換為笛卡爾座標
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),  // x
          r * Math.sin(phi) * Math.sin(theta),  // y
          r * Math.cos(phi)                      // z
        )
      );
      
      // 速度向量：向外擴散 + 隨機擾動
      velocities.push(
        new THREE.Vector3(
          positions[i].x * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.3,  // 基於位置的向外速度 + 隨機偏移
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

    // 階段 0：完整的紅血球（0-2秒）- 緩慢旋轉，呈現困頓狀態
    if (t < 2) {
      phaseRef.current = "whole";
      if (meshRef.current) {
        meshRef.current.visible = true;
        meshRef.current.rotation.y += delta * 0.05;              // 極慢的旋轉
        meshRef.current.position.y = Math.sin(t * 0.4) * 0.02;  // 輕微浮動
      }
      return;
    }

    // 階段 1：破裂中（2-3.5秒）- 紅血球開始分解
    if (t < 3.5) {
      phaseRef.current = "shattering";
      shatterProgressRef.current = Math.min(1, (t - 2) / 1.5);  // 破裂進度 0-1
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        // 快速淡出（不透明度從1降到0）
        mat.opacity = Math.max(0, 1 - shatterProgressRef.current * 2);
        if (mat.opacity <= 0) meshRef.current.visible = false;  // 完全透明後隱藏
      }
    } else {
      // 階段 2：粒子狀態（3.5秒後）
      phaseRef.current = "particles";
      if (meshRef.current) meshRef.current.visible = false;  // 隱藏完整網格
    }

    if (!instancedRef.current) return;

    const p = Math.max(0, t - 2);  // 粒子擴散經過的時間
    const fade = Math.max(0, 1 - Math.max(0, t - 4) / 2.5);  // 淡出係數（4秒後開始淡出）

    // 顏色插值：暗紅色 → 黃褐色（模擬血紅素分解為膽紅素）
    const colorT = Math.min(1, Math.max(0, (t - 2) / 4));  // 顏色過渡進度
    const startColor = new THREE.Color("#7a1520");  // 起始：暗紅色（血紅素）
    const endColor = new THREE.Color("#c87030");    // 結束：黃褐色（膽紅素）
    const currentColor = startColor.clone().lerp(endColor, colorT);  // 線性插值

    // 更新每個粒子的位置、大小和顏色
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 根據速度和時間計算新位置（勻速直線運動）
      dummy.position.set(
        positions[i].x + velocities[i].x * p,  // 初始位置 + 速度 × 時間
        positions[i].y + velocities[i].y * p,
        positions[i].z + velocities[i].z * p
      );
      // 粒子大小隨淡出係數縮小，並添加隨機變化
      const s = fade * (0.06 + Math.random() * 0.02);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);    // 設置變換矩陣
      instancedRef.current.setColorAt(i, currentColor);     // 設置顏色
    }

    // 標記需要更新
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.instanceColor)
      instancedRef.current.instanceColor.needsUpdate = true;

    // 整體粒子網格淡出
    const mat = instancedRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = fade;
    if (fade <= 0.01) instancedRef.current.visible = false;  // 幾乎完全透明時隱藏
  });

  return (
    <group>
      {/* 完整的老化紅血球（橢球形，粗糙表面）*/}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#7a1520"    // 暗紅色
          roughness={0.88}   // 高粗糙度
          metalness={0}      // 無金屬感
          transparent        // 啟用透明度
          opacity={1}        // 初始完全不透明
        />
      </mesh>

      {/* 粒子碎片（使用實例化網格提高性能）*/}
      <instancedMesh ref={instancedRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />  {/* 低多邊形小球體 */}
        <meshStandardMaterial
          roughness={0.7}    // 粗糙表面
          metalness={0}      // 無金屬感
          transparent        // 啟用透明度
          opacity={1}        // 初始完全不透明
        />
      </instancedMesh>
    </group>
  );
}
