import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./uiPages/mainPage/mainPage";
import { FabricTest } from "./uiPages/svgEditor/FabricTest";
import GameDiffIndexPage from "./uiPages/diffGame";
import CalendarPage from "./uiPages/calendar";
import PrivacyPage from "./uiPages/privacy";


function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/svgEditor" element={<FabricTest />} />
        <Route path="/diffGame" element={<GameDiffIndexPage />} />
        <Route path="/Calendar" element={<CalendarPage />} />
        <Route path="/Privacy" element={<PrivacyPage />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
