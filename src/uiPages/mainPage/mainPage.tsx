import React, { useEffect, useState } from "react";
import SingAnimation from "../../animates/signAnimate/signAnimatePage";
import EllipticalCircle from "../../animates/circleAnimate/circleAnimatePage";
import { colorEnum } from "../../components/allEnum";
import IntroducePage from "./introducePage";
import GuidePage from "./guidePage";
import useScrollPostions from "../../entity/useScrollPostions";
import TextButton from "../../components/TextButton";

function MainPage() {
  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <EllipticalCircle
          diameter={0}
          ellipseWidth={280}
          ellipseHeight={280}
          ellipseCount={20}
          strokeColor={colorEnum.primary}
          strokeWidth={1}
          backgroundColor={colorEnum.primary_dark}
        />
        <SingAnimation />
      </div>
      <IntroducePage />
      <GuidePage />
      <MainBottomBar />
    </React.Fragment>
  );
}

function MainBottomBar() {
  const { isAtBottom = false } = useScrollPostions();
  const jsonDoc = require("../../../package.json");

  return (
    <div
      className={
        "d-flex-row ai-center" + ` mainBottomBar ${isAtBottom ? "active" : ""}`
      }
    >
      <div className="" style={{ fontFamily: "Abril Fatface, sans-serif" }}>
        Version {jsonDoc.version}
      </div>

      {/* TODO 頁面按鈕 */}
      <div className="flex-grow-1 justify-content-end d-flex-row ai-center gap-3 ms-3">
        <TextButton text="RSS" onClick={() => {}} />
        <TextButton text="Privacy" onClick={() => {}} />
        <TextButton text="Contact" onClick={() => {}} />
      </div>
    </div>
  );
}

export default MainPage;
