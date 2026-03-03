// // 3D 練習頁面 - 展示紅血球生命週期的互動式 3D 視覺化
// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import RBCScene from './_components/RBCScene';
// import StageController, { RBCStage } from './_components/StageController';
// import { LanguageProvider } from './_components/LanguageContext';

// // 紅血球生命週期練習頁面主組件
// const ThreeJSPracticePage: React.FC = () => {
//   // 當前紅血球生命週期階段（1-5）
//   const [stage, setStage] = useState<RBCStage>(1);
//   // 紅血球是否含氧（用於第 3 階段）
//   const [isOxygenated, setIsOxygenated] = useState<boolean>(true);

//   return (
//     // 使用語言提供者包装應用，以支持多語言功能
//     <LanguageProvider>
//       <div style={{ width: '100vw', height: '100vh', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
//         {/* 階段控制器 UI */}
//         <StageController 
//           stage={stage} 
//           setStage={setStage} 
//           isOxygenated={isOxygenated} 
//           setIsOxygenated={setIsOxygenated} 
//         />
//         {/* 3D Canvas 視景 */}
//         <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
//           {/* 懶加載 RBC 場景組件 */}
//           <Suspense fallback={null}>
//             <RBCScene stage={stage} isOxygenated={isOxygenated} />
//           </Suspense>
//         </Canvas>
//       </div>
//     </LanguageProvider>
//   );
// };

import { useState } from "react";
import RBCCanvas from "./rbc/RBCCanvas";
import { UIPanel } from "./rbc/UIPanel";
import './globals.css'


function ThreeJSPracticePage() {
  const [stage, setStage] = useState(1);
  const [oxygenated, setOxygenated] = useState(true);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background">
      <RBCCanvas stage={stage} oxygenated={oxygenated} />
      <UIPanel
        stage={stage}
        oxygenated={oxygenated}
        onStageChange={setStage}
        onOxygenToggle={() => setOxygenated((v) => !v)}
      />
    </main>
  );
}

// 導出頁面組件
export default ThreeJSPracticePage;