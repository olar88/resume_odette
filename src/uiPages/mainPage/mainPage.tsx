import React, { useEffect, useState } from "react";
import SingAnimation from "../../animates/signAnimate/signAnimatePage";
import EllipticalCircle from "../../animates/circleAnimate/circleAnimatePage";
import { colorEnum } from "../../components/allEnum";
import GuidePage from "./guidePage";
import useScrollPostions from "../../entity/useScrollPostions";
import TextButton from "../../components/TextButton";
import EmailIcon from "../../svg/img_email";
import GitHubIcon from "../../svg/img_gitHub";
import { useNavigate } from "react-router-dom";
import IntroducePage from "./introducePage";

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
  const navigate = useNavigate()

  return (
    <div
      className={
        "d-flex-row ai-center" + ` mainBottomBar ${isAtBottom ? "active" : ""}`
      }
    >
      <div className="" style={{ fontFamily: "Abril Fatface, sans-serif" }}>
        Version {jsonDoc.version}
      </div>

      <div className="flex-grow-1 justify-content-end d-flex-row ai-center gap-3 ms-3">
        <TextButton text="RSS" onClick={() => { window.open("https://github.com/olar88/resume_odette_private") }} />
        {/* <TextButton text="Privacy" onClick={() => { window.open("https://github.com/olar88/resume_odette_private") }} />
        <TextButton text="Contact" onClick={() => { }} /> */}
      </div>
    </div>
  );
}

/** 首頁聯繫資訊按鈕 */
function ContactIconBtnBar() {

  return <React.Fragment>
    <div className="d-sm-none d-md-flex w-100 justify-content-end gap-2 me-2">
      <div className="iconBtn" style={{ width: "40px" }}>
        <a href="mailto:parkeunyeon18@gmail.com" target="_blank" rel="noreferrer">
          <EmailIcon className=" w-100" />
        </a>
      </div>

      <div className="iconBtn" style={{ width: "45px" }}>
        <a href="https://github.com/olar88" target="_blank" rel="noreferrer">
          <GitHubIcon className=" w-100" />
        </a>
      </div>
    </div>

  </React.Fragment>
}

export default MainPage;
