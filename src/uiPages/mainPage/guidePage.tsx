import React from "react";
import { colorEnum, directionEnum } from "../../components/allEnum";
import SquareCardButton from "../../components/SquareCardButton";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";
import SvgEditorIcon from "../../svg/img_svgEditor";
import DiffGameIcon from "../../svg/img_diffGameIcon";

function GuidePage() {
  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <div className="container row h-50 flex-wrap">
          {/* 按鈕區 */}
          <AnimatedShowUpComponent
            className="col-6 h-50 p-0"
            direction={directionEnum.Down}
          >
            <SquareCardButton
              mainContent={<SvgEditorIcon  className="flex-grow-1 m-auto"/>}
              textContent="SVG Editor"
              backgroundColor={colorEnum.warning}
              contentColor={colorEnum.primary}
              className="h-100"
            />
          </AnimatedShowUpComponent>
          <AnimatedShowUpComponent
            className="col-6 h-50 p-0"
            direction={directionEnum.Down}
            transitionDelay=".3s"
          >
            <SquareCardButton
              mainContent={<DiffGameIcon className="flex-grow-1 m-auto"/>}
              textContent="Game Design"
              backgroundColor={colorEnum.alert}
              contentColor={colorEnum.white}
              className="h-100"
            />
          </AnimatedShowUpComponent>
          <AnimatedShowUpComponent
            className="col-12 h-50 p-0"
            direction={directionEnum.Down}
            transitionDelay=".6s"
          >
            <SquareCardButton
              mainContent={"null"}
              textContent="Calander"
              backgroundColor={colorEnum.primary}
              contentColor={colorEnum.white}
              className="h-100"
            />
          </AnimatedShowUpComponent>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GuidePage;
