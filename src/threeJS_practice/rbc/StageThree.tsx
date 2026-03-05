"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StageThreeProps {
  oxygenated: boolean;  // 是否為攜氧狀態
}

// 攜氧血（動脈血）的鮮紅色
const OXY_COLOR = new THREE.Color("#e8152a");
// 去氧血（靜脈血）的暗紅色（注意：不是藍色！）
const DEOXY_COLOR = new THREE.Color("#5a0a10");

/**
 * 階段三：功能性紅血球 - 攜氧與去氧狀態
 * 展示紅血球在攜氧（氧合血紅素）和去氧（脫氧血紅素）之間的轉換
 * 包含顏色變化和動態搖擺效果
 */
export function StageThree({ oxygenated }: StageThreeProps) {
  const meshRef = useRef<THREE.Mesh>(null);                     // 網格引用
  const matRef = useRef<THREE.MeshStandardMaterial>(null);     // 材質引用
  const timeRef = useRef(0);                                    // 時間累積器
  const lerpColor = useRef(new THREE.Color(OXY_COLOR));        // 用於顏色平滑過渡的色彩緩存

  // 創建雙凹盤形幾何體（與階段二相同的形狀）
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);  // 創建球體
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const originalY = new Float32Array(pos.count);    // 儲存Y座標

    // 將球體變形為雙凹盤形
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.sqrt(x * x + z * z);  // 徑向距離
      // 雙凹輪廓方程
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

    // 平滑的顏色過渡（攜氧 ↔ 去氧）
    const target = oxygenated ? OXY_COLOR : DEOXY_COLOR;  // 目標顏色
    lerpColor.current.lerp(target, delta * 3);            // 線性插值過渡
    matRef.current.color.copy(lerpColor.current);         // 更新主顏色
    matRef.current.emissive.copy(lerpColor.current).multiplyScalar(0.15);  // 更新自發光顏色
    
    // 根據氧合狀態調整表面粗糙度（攜氧時更光滑）
    matRef.current.roughness = oxygenated
      ? THREE.MathUtils.lerp(matRef.current.roughness, 0.2, delta * 3)   // 攜氧：光滑
      : THREE.MathUtils.lerp(matRef.current.roughness, 0.55, delta * 3);  // 去氧：較粗糙
    
    // 根據氧合狀態調整金屬度
    matRef.current.metalness = oxygenated
      ? THREE.MathUtils.lerp(matRef.current.metalness, 0.12, delta * 3)  // 攜氧：略有反光
      : THREE.MathUtils.lerp(matRef.current.metalness, 0.02, delta * 3);  // 去氧：幾乎無反光

    // 浮動和搖擺動畫
    meshRef.current.position.y = Math.sin(t * 1.1) * 0.08;  // 垂直浮動
    meshRef.current.rotation.y += delta * 0.25;              // 持續旋轉

    // 搖擺變形效果（模擬紅血球在血流中的柔軟特性）
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const origY = meshRef.current.geometry.attributes.originalY as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const base = origY.getX(i);  // 基礎Y座標
      // 使用正弦波創造波動效果
      const wobble = Math.sin(t * 2.5 + x * 3.5 + z * 2.0) * 0.03;
      pos.setY(i, base + wobble);
    }
    pos.needsUpdate = true;  // 標記更新
    meshRef.current.geometry.computeVertexNormals();  // 重新計算法向量
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={matRef}
        color={OXY_COLOR}             // 初始顏色：攜氧狀態的鮮紅色
        roughness={0.2}               // 初始粗糙度：較光滑
        metalness={0.12}              // 初始金屬度：略有反光
        emissive="#330005"            // 自發光顏色：深紅色
        emissiveIntensity={0.15}      // 自發光強度
      />
    </mesh>
  );
}
