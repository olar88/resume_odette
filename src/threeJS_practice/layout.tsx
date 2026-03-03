import React from 'react'
import './globals.css'

// 網頁的 Meta 資訊 (如 title, description, icons 等)
// 在一般 React 專案中 (如 Vite, Create React App)，通常會放置在 public/index.html 的 <head> 中，
// 或是使用 react-helmet-async 等套件動態管理。
// 此處保留原先的設定供參考：
/*
export const metadata = {
  title: '紅血球的一生 | RBC Life Cycle 3D',
  description: '以 React Three Fiber 製作的紅血球 (RBC) 一生 3D 互動視覺化',
  generator: 'v0.app',
  icons: { ... }
}
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans antialiased w-full h-full min-h-screen">
      {children}
    </div>
  )
}
