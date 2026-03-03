# 🔬 Three.js 紅血球動畫 - 新手學習指南

## 📋 概述

這是一個完整的 Three.js 教學項目，展示如何創建一個帶有動畫的 3D 紅血球模型。代碼包含**詳細的中文註解**，非常適合新手學習 Three.js 的基礎概念。

## 🎯 學習目標

通過這個項目，你將學會：

- ✅ **幾何體（Geometry）** - 如何創建和修改 3D 頂點
- ✅ **材質（Material）** - 設置物體的外觀和光學性質
- ✅ **動畫（Animation）** - 使用 `useFrame` 創建流暢的實時動畫
- ✅ **光照（Lighting）** - 設置多種光源類型
- ✅ **相機（Camera）** - 配置視角和投影
- ✅ **組件化設計** - 編寫可重用的 React Three Fiber 組件

## 📁 文件結構

```
src/threeJS_practice/rbc/
├── RedBloodCellPage.tsx        # 主要組件 - 完整教學版本 ⭐
├── RedBloodCellPage.example.tsx # 使用範例 - 5 個實用示例
└── README.md                    # 本文檔
```

## 🚀 快速開始

### 方式 1：導入並使用組件

```tsx
import { RedBloodCellPage } from "./RedBloodCellPage";

// 全屏使用
export default function MyPage() {
  return <RedBloodCellPage />;
}

// 或指定尺寸
export default function MyPage() {
  return <RedBloodCellPage width={800} height={600} />;
}

// 或響應式
export default function MyPage() {
  return <RedBloodCellPage width="80%" height="500px" />;
}
```

### 方式 2：查看示例

```tsx
import { Example1_Fullscreen } from "./RedBloodCellPage.example";

export default function Demo() {
  return <Example1_Fullscreen />;
}
```

## 📚 核心概念詳解

### 1️⃣ 幾何體（Geometry）

```tsx
// 步驟 1：創建基础球体
const geo = new THREE.SphereGeometry(1, 64, 64);
//                                    ↑  ↑   ↑
//                                    半径 水平分段 垂直分段

// 步驟 2：取得頂點位置
const pos = geo.attributes.position as THREE.BufferAttribute;

// 步驟 3：遍歷每個頂點並修改
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const y = pos.getY(i);
  const z = pos.getZ(i);
  
  // 使用數學公式變換 Y 座標
  const r = Math.sqrt(x * x + z * z);
  const profile = 0.28 + 1.1 * r * r - 0.9 * r * r * r * r;
  const newY = y * profile * 0.75;
  
  pos.setY(i, newY);
}

// 步驟 4：通知 Three.js 更新
geo.computeVertexNormals();
```

**關鍵概念：**
- `SphereGeometry` 是球形幾何體
- 修改頂點可以改變形狀
- `computeVertexNormals()` 重新計算光照用的法向量

### 2️⃣ 材質（Material）

```tsx
<meshStandardMaterial
  color="#cc2233"              // 基礎顏色（紅色）
  roughness={0.25}             // 粗糙度（0 = 光亮，1 = 粗糙）
  metalness={0.05}             // 金屬度（0 = 非金屬，1 = 完全金屬）
  emissive="#660011"           // 自發光顏色
  emissiveIntensity={0.12}     // 自發光強度
/>
```

**常用材質類型：**
- `meshBasicMaterial` - 最簡單，無光照
- `meshLambertMaterial` - 簡單光照，表現粗糙材質
- `meshPhongMaterial` - 更好的光照，有高光
- `meshStandardMaterial` - **推薦**，基於物理的渲染（PBR）

### 3️⃣ 動畫（Animation Loop）

```tsx
useFrame((_, delta) => {
  // delta：上一幀到現在的時間（秒）
  
  timeRef.current += delta;  // 累積時間
  const t = timeRef.current;
  
  // 使用三角函數創造平滑動畫
  mesh.position.y = Math.sin(t * 1.1) * 0.08;  // 上下脈動
  mesh.rotation.y += delta * 0.25;              // 持續旋轉
  
  // 修改頂點（高級動畫）
  const pos = mesh.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const wobble = Math.sin(t * 2.5 + x * 3.5) * 0.03;
    pos.setY(i, base + wobble);
  }
  pos.needsUpdate = true;
});
```

**重要：**
- `useFrame` 在每幀執行（通常 60fps）
- 修改頂點後必須設置 `needsUpdate = true`

### 4️⃣ 光照（Lighting）

Three.js 提供多種光源類型：

```tsx
// 環境光 - 全局均勻光
<ambientLight intensity={0.6} />

// 方向光 - 如太陽光，有方向但無衰減
<directionalLight 
  position={[5, 5, 5]} 
  intensity={1.2} 
/>

// 點光源 - 從一點發出光線，有衰減
<pointLight 
  position={[-5, 3, 3]} 
  intensity={0.8} 
/>

// 聚光燈 - 錐形光束
<spotLight 
  position={[10, 10, 5]} 
  intensity={1} 
/>
```

### 5️⃣ 相機（Camera）

```tsx
<perspectiveCamera
  fov={60}          // 視場角（45-75 是常見範圍）
  near={0.1}        // 近裁面（太小會有精度問題）
  far={1000}        // 遠裁面（優化性能）
  position={[0, 0, 3]}  // 相機位置
/>
```

## 🎨 Props 配置

```tsx
interface RedBloodCellPageProps {
  width?: string | number;    // "100%" 或 800
  height?: string | number;   // "100%" 或 600
  className?: string;         // 額外的 CSS class
}
```

**使用示例：**

```tsx
// 全屏
<RedBloodCellPage />

// 固定尺寸
<RedBloodCellPage width={800} height={600} />

// 響應式
<RedBloodCellPage width="100%" height="500px" />

// 添加自定義样式
<RedBloodCellPage 
  width="90%" 
  height="400px"
  className="my-custom-class"
/>
```

## 🔧 修改與自定義

### 改變顏色

```tsx
// 在 RedBloodCell 组件中修改 meshStandardMaterial
<meshStandardMaterial
  color="#0099ff"  // 改變為藍色
/>
```

### 改變旋轉速度

```tsx
// 在 useFrame 中調整係數
meshRef.current.rotation.y += delta * 0.5;  // 更快旋轉（原值 0.25）
```

### 改變動畫强度

```tsx
// 修改這些係數
meshRef.current.position.y = Math.sin(t * 1.1) * 0.15;  // 更大脈動
const wobble = Math.sin(t * 2.5 + x * 3.5) * 0.05;      // 更強抖動
```

### 添加互動控制

```tsx
// 在 Canvas 中取消註解 OrbitControls
import { OrbitControls } from "@react-three/drei";

<Canvas>
  {/* ... */}
  <OrbitControls />  // 現在可以用滑鼠旋轉視角
</Canvas>
```

## 📊 性能優化建議

| 優化項 | 說明 |
|------|------|
| `useMemo` | 幾何體只建立一次 |
| `useRef` | 避免重新渲染時建立新引用 |
| 分段數 | 降低 64x64 為 32x32 可提升性能 |
| 禁用陰影 | 移除 `castShadow` 以提速 |
| 簡化幾何 | 使用 LOD（Level of Detail） |

## 🐛 常見問題 (FAQ)

### Q: 黑屏或看不到物體？
**A:** 檢查：
1. 相機位置是否正確（通常 `[0, 0, 3]`）
2. 是否有光源（至少加 `<ambientLight />`）
3. 材質顏色是否與背景相同

### Q: 物體看起來不光滑？
**A:** 增加球體分段數：
```tsx
new THREE.SphereGeometry(1, 128, 128)  // 從 64 改為 128
```

### Q: 動畫卡頓？
**A:** 試試：
1. 降低分段數
2. 簡化 `wobble` 計算
3. 移除不必要的光源

### Q: 如何保存或導出 3D 模型？
**A:** 可以使用 Three.js 的匯出器：
```tsx
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
```

## 📖 延伸學習資源

- [Three.js 官方文檔](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js 中文文檔](https://threejs.org/docs/index.html?q=中文)

## 💡 下一步項目建議

1. **添加紋理** - 使用 `THREE.TextureLoader` 添加圖片紋理
2. **多物體場景** - 渲染多個紅血球相互交互
3. **物理引擎** - 使用 Cannon.js 添加碰撞檢測
4. **UI 交互** - 添加按鈕控制動畫參數
5. **導出功能** - 將 3D 模型導出為 GLB 或 STL 格式

## 📝 許可證

MIT License - 自由使用和修改

---

**祝你學習愉快！如有問題，請查看代碼中的詳細註解。** 🚀
