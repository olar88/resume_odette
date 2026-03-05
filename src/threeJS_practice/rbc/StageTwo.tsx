"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 階段二：成熟的雙凹盤狀紅血球
 * 這是紅血球的正常成熟形態，具有特徵性的雙凹碟形
 * 這種形狀增加表面積，有利於氣體交換
 */
export function StageTwo() {
  const meshRef = useRef<THREE.Mesh>(null);  // 網格引用
  const timeRef = useRef(0);                 // 時間累積器

  // 通過修改球體頂點來構建雙凹盤形幾何體
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);  // 創建高解析度球體
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const originalY = new Float32Array(pos.count);    // 儲存原始Y座標供後續動畫使用

    // 遍歷所有頂點，修改為雙凹形狀
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // 計算在XZ平面上的徑向距離
      const r = Math.sqrt(x * x + z * z);

      // 雙凹輪廓：根據XZ半徑壓縮Y值
      // 使用經典雙凹方程：y' = y * (a + b*r^2 + c*r^4)
      // 這創造出中間凹陷、邊緣凸起的碟形
      const profile = 0.28 + 1.1 * r * r - 0.9 * r * r * r * r;
      const newY = y * profile * 0.75;

      pos.setY(i, newY);
      originalY[i] = newY;  // 儲存處理後的Y座標
    }

    geo.setAttribute("originalY", new THREE.BufferAttribute(originalY, 1));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // 溫和的垂直浮動
    meshRef.current.position.y = Math.sin(t * 1.1) * 0.08;
    // 緩慢旋轉
    meshRef.current.rotation.y += delta * 0.25;
    // 輕微的搖擺傾斜（模擬在血流中的運動）
    meshRef.current.rotation.z = Math.sin(t * 0.9) * 0.06;
    meshRef.current.rotation.x = Math.cos(t * 0.7) * 0.04;

    // 搖擺變形（果凍效果）- 模擬紅血球的柔軟彈性
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const origY = meshRef.current.geometry.attributes.originalY as THREE.BufferAttribute;

    // 對每個頂點添加基於時間和位置的正弦波動
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const base = origY.getX(i);  // 獲取基礎Y座標
      // 創造波紋效果：使用不同頻率的正弦波
      const wobble = Math.sin(t * 2.5 + x * 3.5 + z * 2.0) * 0.03;
      pos.setY(i, base + wobble);  // 應用搖擺偏移
    }
    pos.needsUpdate = true;  // 標記位置需要更新
    meshRef.current.geometry.computeVertexNormals();  // 重新計算法向量以正確顯示光照
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#cc2233"           // 健康的紅色
        roughness={0.25}          // 略微光滑
        metalness={0.05}          // 幾乎不反光
        emissive="#660011"        // 暗紅色自發光
        emissiveIntensity={0.12}  // 輕微發光強度
      />
    </mesh>
  );
}
