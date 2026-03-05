"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 偽隨機雜訊函數（類似 Simplex 雜訊）
 * 用於創造表面粗糙度效果
 * @param x, y, z - 3D 座標
 * @returns 0-1 之間的偽隨機值
 */
function pseudoNoise(x: number, y: number, z: number): number {
  const dot = x * 127.1 + y * 311.7 + z * 74.3;  // 使用質數縮放以產生偽隨機性
  return (Math.sin(dot) * 43758.5453) % 1;        // 正弦函數搭配大數產生雜訊
}

/**
 * 階段四：老化紅血球
 * 模擬紅血球老化過程，形狀變得不規則、粗糙
 * 失去雙凹盤形，變成較球形且表面凹凸不平
 */
export function StageFour() {
  const meshRef = useRef<THREE.Mesh>(null);  // 網格引用
  const timeRef = useRef(0);                 // 時間累積器

  // 構建變形球體（類橢球形，較僵硬）
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);  // 創建高解析度球體
    const pos = geo.attributes.position as THREE.BufferAttribute;

    // 為每個頂點添加不規則變形
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // 添加凹凸不平的雜訊位移（老化細胞的粗糙表面）
      // 使用兩層不同頻率的雜訊疊加
      const noise =
        pseudoNoise(x * 2.1, y * 2.1, z * 2.1) * 0.12 +  // 大範圍凹凸
        pseudoNoise(x * 5.3, y * 5.3, z * 5.3) * 0.05;   // 小範圍細節

      const len = Math.sqrt(x * x + y * y + z * z);  // 原始半徑
      const scale = (len + noise) / len;              // 計算縮放比例
      pos.setXYZ(i, x * scale, y * scale * 0.88, z * scale); // 應用變形，Y軸略微壓扁
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // 緩慢、遲鈍的運動（模擬老化細胞的活力降低）
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.04;  // 垂直浮動幅度小
    meshRef.current.rotation.y += delta * 0.08;              // 旋轉速度慢
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.02;  // 輕微的X軸傾斜
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#7a1520"           // 暗紅色（老化血紅素顏色變深）
        roughness={0.85}          // 高粗糙度（表面不光滑）
        metalness={0.0}           // 無金屬感
        emissive="#1a0305"        // 極暗的自發光
        emissiveIntensity={0.08}  // 低自發光強度（細胞活力降低）
      />
    </mesh>
  );
}
