import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ========================================
 * 紅血球動畫組件 - Three.js 新手教學版本
 * ========================================
 * 
 * 這是一個完整的 Three.js 應用程式，展示如何：
 * 1. 創建自定義幾何體（geometry）
 * 2. 應用材質（material）和著色
 * 3. 使用 useFrame 進行動畫更新
 * 4. 動態修改頂點位置創造變形效果
 */

/**
 * RedBloodCell 組件
 * 
 * 功能：渲染一個帶有脈動和旋轉動畫的紅血球形狀
 * 
 * 主要實現：
 * - 使用球體幾何體（SphereGeometry）作為基礎
 * - 通過修改頂點位置創造雙凹盤形狀
 * - 添加實時動畫效果：旋轉、脈動、抖動
 */
function RedBloodCell() {
  // === 參考引用 (Refs) ===
  // meshRef：用來儲存網格對象的引用，讓我們能在 useFrame 中訪問它
  const meshRef = useRef<THREE.Mesh>(null);
  
  // timeRef：追蹤經過的時間，用於計算動畫參數
  const timeRef = useRef(0);

  /**
   * === 幾何體製作 (Geometry Creation) ===
   * useMemo 確保幾何體只建立一次，提高效能
   */
  const geometry = useMemo(() => {
    // 步驟1：建立基礎球體
    // 64, 64 表示水平和垂直分段數，數字越大細節越精細
    const geo = new THREE.SphereGeometry(1, 64, 64);
    
    // 步驟2：取得頂點位置屬性
    // 這包含了球體上所有頂點的 X, Y, Z 座標
    const pos = geo.attributes.position as THREE.BufferAttribute;
    
    // 步驟3：建立陣列儲存原始 Y 值
    // 後續動畫時需要這些值作為基準
    const originalY = new Float32Array(pos.count);

    /**
     * 步驟4：修改每個頂點，創造雙凹盤形狀
     * 這就是紅血球特有的「甜甜圈」形狀
     */
    for (let i = 0; i < pos.count; i++) {
      // 獲取當前頂點的座標
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // 計算頂點到中心軸的距離（XZ 平面的徑向距離）
      // 這用來決定該點應該被壓縮多少
      const r = Math.sqrt(x * x + z * z);

      /**
       * 雙凹盤公式：
       * 核心概念：邊緣壓縮，中心較高
       * y' = y * (a + b*r² + c*r⁴)
       * 
       * 這個公式確保：
       * - r = 0（中心）：profile = 0.28（較少壓縮）
       * - r = 1（邊緣）：profile 較大（壓縮更多）
       * - 表現出典型的紅血球形狀
       */
      const profile = 0.28 + 1.1 * r * r - 0.9 * r * r * r * r;
      const newY = y * profile * 0.75;

      // 應用新的 Y 座標
      pos.setY(i, newY);
      // 儲存原始值供後續動畫使用
      originalY[i] = newY;
    }

    // 步驟5：將原始 Y 值儲存為自定義屬性
    // 這樣在 useFrame 中可以訪問並恢復基礎形狀
    geo.setAttribute("originalY", new THREE.BufferAttribute(originalY, 1));
    
    // 步驟6：重新計算法向量
    // 法向量影響光照計算，必須在修改頂點後更新
    geo.computeVertexNormals();
    
    return geo;
  }, []); // 空依賴陣列表示此 effect 只運行一次

  /**
   * === 動畫更新 (Animation Loop) ===
   * useFrame 在每一幀都會被調用（通常 60fps）
   * delta：自上一幀經過的時間（秒）
   */
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // 更新時間計數器
    timeRef.current += delta;
    const t = timeRef.current;

    // --- 位移動畫 (Position Animation) ---
    // 使用 sin 函數創造平滑的上下脈動效果
    // * 0.08 控制脈動幅度
    meshRef.current.position.y = Math.sin(t * 1.1) * 0.08;

    // --- 旋轉動畫 (Rotation Animation) ---
    // 每幀增加旋轉角度，持續旋轉
    // * 0.25 控制旋轉速度
    meshRef.current.rotation.y += delta * 0.25;
    
    // 細微的搖晃傾斜（Z 軸）
    meshRef.current.rotation.z = Math.sin(t * 0.9) * 0.06;
    
    // 細微的搖晃傾斜（X 軸）
    meshRef.current.rotation.x = Math.cos(t * 0.7) * 0.04;

    /**
     * --- 頂點變形動畫 (Vertex Deformation Animation) ---
     * 這創造"果凍"抖動效果，使紅血球看起來有彈性和活力
     */
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const origY = meshRef.current.geometry.attributes.originalY as THREE.BufferAttribute;

    // 遍歷每個頂點
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // 獲取原始 Y 座標（未變形的）
      const base = origY.getX(i);
      
      /**
       * 抖動公式：
       * wobble = sin(時間 + 空間偏移) * 幅度
       * 
       * 參數解釋：
       * - t * 2.5：時間參數，控制抖動速度
       * - x * 3.5：X 位置相位，讓不同位置的顛簸錯開
       * - z * 2.0：Z 位置相位，增加複雜性
       * - * 0.03：振幅，限制變形程度
       */
      const wobble = Math.sin(t * 2.5 + x * 3.5 + z * 2.0) * 0.03;
      
      // 應用基礎形狀加上抖動效果
      pos.setY(i, base + wobble);
    }
    
    // 通知 Three.js 頂點位置已更新
    // 這會觸發重新渲染
    pos.needsUpdate = true;
    
    // 重新計算法向量以保證光照正確
    meshRef.current.geometry.computeVertexNormals();
  });

  /**
   * === 返回網格 (Mesh Return) ===
   * 網格由幾何體 + 材質組成
   */
  return (
    <mesh ref={meshRef} geometry={geometry}>
      {/* 網格標準材質：支持光照和陰影 */}
      <meshStandardMaterial
        // 顏色：紅色
        color="#cc2233"
        // 粗糙度：0 = 光亮，1 = 粗糙（紅血球應該光滑）
        roughness={0.25}
        // 金屬度：0 = 非金屬，1 = 完全金屬（紅血球是生物體，不是金屬）
        metalness={0.05}
        // 自發光顏色：深紅色
        emissive="#660011"
        // 自發光強度：0 = 無，1 = 完全
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

/**
 * 光源組件
 * 
 * Three.js 場景需要光源才能看到物體
 * 這裡使用多個光源創造豐富的光照效果
 */
function Lighting() {
  return (
    <>
      {/* 環境光：全局光，照亮所有物體 */}
      {/* 強度較弱，用來提供基礎亮度 */}
      <ambientLight intensity={0.6} />

      {/* 方向光：模擬遠方光源（如太陽） */}
      {/* 位置在上方和左側 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        // 投射陰影（可選，提高真實感）
        castShadow
      />

      {/* 點光源：從另一個角度照射 */}
      {/* 創造更多的光影層次 */}
      <pointLight position={[-5, 3, 3]} intensity={0.8} />
    </>
  );
}

/**
 * 相機組件
 * 
 * 定義觀看 3D 場景的視角
 * 使用透視相機（perspectiveCamera）模擬人眼視角
 */
function CameraSetup() {
  return (
    <perspectiveCamera
      // 視場角（FOV）：越大視角越寬，越小越單焦
      // 60 是比較標準的選擇
      fov={60}
      // 近裁面：更近的物體會被隱藏（優化性能）
      near={0.1}
      // 遠裁面：更遠的物體會被隱藏（優化性能）
      far={1000}
      // 相機位置：[x, y, z]（在 +Z 方向看向原點）
      position={[0, 0, 3]}
      // 相機看向的目標點
      lookAt={[0, 0, 0]}
    />
  );
}

/**
 * 場景背景組件
 * 定義 3D 場景的背景顏色
 */
function SceneBackground() {
  return <color attach="background" args={["#f8e9a1"]} />; // 透明背景
}

/**
 * ========================================
 * 主要頁面組件：RedBloodCellPage
 * ========================================
 * 
 * Props：
 * - width：Canvas 寬度（像素或百分比）
 * - height：Canvas 高度（像素或百分比）
 * - className：額外的 CSS class（可選）
 */
interface RedBloodCellPageProps {
  /** Canvas 寬度，默認值 100% */
  width?: string | number;
  /** Canvas 高度，默認值 100% */
  height?: string | number;
  /** 額外的 CSS class 名稱 */
  className?: string;
}

export function RedBloodCellPage({
  width = "100%",
  height = "100%",
  className = "",
}: RedBloodCellPageProps) {
  /**
   * 計算容器樣式
   * 轉換數值為 px，字符串保持原樣
   */
  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    // 相對定位以便內部絕對定位能正常工作
    position: "relative",
  };

  return (
    <div className={className} style={containerStyle}>
      {/* 
        Canvas：React Three Fiber 的主容器
        所有 3D 内容都在这里渲染
      */}
      <Canvas
        // 相機自動管理（推薦）
        camera={{ position: [0, 0, 3], fov: 60 }}
        // 抗鋸齒，讓邊緣更光滑
        dpr={[1, 2]}
        // 禁用色調映射以保持顏色準確
        gl={{
          antialias: true,
        }}
      >
        {/* 設定背景顏色 */}
        <SceneBackground />

        {/* 設定光源 */}
        <Lighting />

        {/* 渲染紅血球 */}
        <RedBloodCell />

        {/* 
          軌道控制器：允許用戶通過滑鼠交互相機
          按住滑鼠可以旋轉視角
          這對學習和調試很有幫助
        */}
        {/* 以下是可選的互動控制 */}
        {/* 如果要啟用，請取消下面的註解並確保已導入 OrbitControls */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
