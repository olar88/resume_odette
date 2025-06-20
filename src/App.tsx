import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./uiPages/mainPage/mainPage";
import { FabricTest } from "./uiPages/svgEditor/FabricTest";


function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/svgEditor" element={<FabricTest />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
