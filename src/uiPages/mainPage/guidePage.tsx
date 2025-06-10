import React from "react";
import { colorEnum } from "../../components/allEnum";
import SquareCardButton from "../../components/SquareCardButton";

function GuidePage() {
  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <div className="container row h-50 flex-wrap">
          {/* 按鈕區 */}
          <SquareCardButton
            mainContent={<img src="../../svg/img_html.svg" alt="icon" />}
            textContent="HTML / CSS design"
            backgroundColor={colorEnum.warning}
            contentColor={colorEnum.primary}
            className="col-6"
          />
          <SquareCardButton
            mainContent={"null"}
            textContent="REACT"
            backgroundColor={colorEnum.primary}
            contentColor={colorEnum.white}
            className="col-6"
          />
          <SquareCardButton
            mainContent={"null"}
            textContent="Android / Kotlin"
            backgroundColor={colorEnum.alert}
            contentColor={colorEnum.white}
            className="col-12"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default GuidePage;
