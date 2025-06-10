import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./uiPages/mainPage/mainPage";

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
