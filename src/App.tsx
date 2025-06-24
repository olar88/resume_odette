import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./uiPages/mainPage/mainPage";
import { FabricTest } from "./uiPages/svgEditor/FabricTest";
import GameDiffIndexPage from "./uiPages/diffGame";


function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/svgEditor" element={<FabricTest />} />
        <Route path="/diffGame" element={<GameDiffIndexPage />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
