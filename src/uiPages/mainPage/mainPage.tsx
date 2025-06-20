import React, { useEffect, useState } from "react";
import SingAnimation from "../../animates/signAnimate/signAnimatePage";
import EllipticalCircle from "../../animates/circleAnimate/circleAnimatePage";
import { colorEnum } from "../../components/allEnum";
import IntroducePage from "./introducePage";
import GuidePage from "./guidePage";
import useScrollPostions from "../../entity/useScrollPostions";
import TextButton from "../../components/TextButton";
import EmailIcon from "../../svg/img_email";
import GitHubIcon from "../../svg/img_gitHub";

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
        <ContactIconBtnBar />
      </div>
      <IntroducePage />
      <GuidePage />
      <MainBottomBar />
    </React.Fragment>
  );
}

/** 底部欄 */
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
        <TextButton text="RSS" onClick={() => { }} />
        <TextButton text="Privacy" onClick={() => { }} />
        <TextButton text="Contact" onClick={() => { }} />
      </div>
    </div>
  );
}

/** 首頁聯繫資訊按鈕 */
function ContactIconBtnBar() {

  return <React.Fragment>
    <div className="d-md-flex d-none w-100 justify-content-end gap-2 me-2">
      <div className="" style={{ width: "30px" }}>
        <a href="mailto:parkeunyeon18@gmail.com" target="_blank">
          <EmailIcon className=" w-100" />
        </a>
      </div>

      <div className="" style={{ width: "35px" }}>
        <a href="https://github.com/olar88" target="_blank">
          <GitHubIcon className=" w-100" />
        </a>
      </div>
    </div>

  </React.Fragment>
}

export default MainPage;
