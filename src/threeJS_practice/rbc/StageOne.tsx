"use client";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StageOneProps {
  isActive: boolean;  // 是否啟動細胞核排出動畫
}

/**
 * 階段一：核紅血球（Reticulocyte）排出細胞核
 * 模擬從有核細胞轉變為成熟紅血球的過程
 */
export function StageOne({ isActive }: StageOneProps) {
  const groupRef = useRef<THREE.Group>(null);    // 整體群組引用
  const nucleusRef = useRef<THREE.Mesh>(null);   // 細胞核引用
  const outerRef = useRef<THREE.Mesh>(null);     // 外層細胞膜引用

  // 追蹤動畫進度：0 = 細胞核在內部，1 = 細胞核已排出
  const progressRef = useRef(0);
  const [nucleusGone, setNucleusGone] = useState(false);  // 細胞核是否已完全消失

  // 當 isActive 變化時重置動畫狀態
  useEffect(() => {
    if (isActive) {
      progressRef.current = 0;
      setNucleusGone(false);
    }
  }, [isActive]);

  useFrame((_, delta) => {
    if (!groupRef.current || !nucleusRef.current || !outerRef.current) return;

    // 整體群組的溫和浮動與旋轉效果
    groupRef.current.rotation.y += delta * 0.3;  // 持續旋轉
    groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05;  // 上下浮動

    if (!isActive) return;  // 如果未啟動，不執行排出動畫

    // 推進細胞核排出動畫
    if (progressRef.current < 1) {
      progressRef.current = Math.min(1, progressRef.current + delta * 0.35);
    }

    const p = progressRef.current;

    // 細胞核縮小並向外移動
    const nucleusScale = Math.max(0, 1 - p);  // 從1縮小到0
    nucleusRef.current.scale.setScalar(nucleusScale);
    nucleusRef.current.position.set(p * 1.6, 0, 0);  // 向X軸正方向移動

    // 當進度達到100%時，標記細胞核已消失
    if (p >= 1 && !nucleusGone) {
      setNucleusGone(true);
    }

    // 細胞核離開時，外層細胞膜輕微塌陷（網狀細胞變形）
    const outerScale = 1 - p * 0.15;
    outerRef.current.scale.set(outerScale, outerScale * (1 - p * 0.12), outerScale);
  });

  return (
    <group ref={groupRef}>
      {/* 外層細胞膜 - 半透明果凍狀球體 */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#cc3344"      // 紅色
          transmission={0.75}  // 透光度
          opacity={0.85}       // 不透明度
          transparent
          roughness={0.08}     // 光滑表面
          metalness={0}
          thickness={1.2}      // 厚度
          ior={1.35}          // 折射率
          attenuationColor="#cc1122"    // 衰減顏色
          attenuationDistance={2}        // 衰減距離
        />
      </mesh>

      {/* 內部細胞核 - 深色實心球體 */}
      {!nucleusGone && (
        <mesh ref={nucleusRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />  {/* 較小的球體 */}
          <meshStandardMaterial
            color="#1a0a0a"   // 深褐黑色
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* 內層微光層 - 創造內部發光效果 */}
      <mesh>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff2244"      // 亮紅色
          transmission={0.9}   // 高透光度
          opacity={0.3}        // 低不透明度
          transparent
          roughness={0.2}
          emissive="#aa1122"          // 自發光顏色
          emissiveIntensity={0.15}    // 自發光強度
        />
      </mesh>
    </group>
  );
}
