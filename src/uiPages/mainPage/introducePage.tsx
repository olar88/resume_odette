import React, { RefObject, useEffect, useRef, useState } from "react";
import { colorEnum, directionEnum } from "../../components/allEnum";
import SquareCardButton from "../../components/SquareCardButton";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";
import Sliders from "../../components/sliders";

function IntroducePage() {
  const [activeNow, setActiveNow] = useState(0);

  function introSlideClick(indx: number) {
    setActiveNow(indx);
  }

  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <div className="container row">
          {/* TODO slide 頁面 */}

          {/* 動畫區 */}
          <AnimatedShowUpComponent className="col-7 h-100 mh-100 p-0">
            <Sliders
              activeIndex={activeNow}
              component={[
                <div className="w100 h-100" style={{ background: "pink" }}>
                  第1頁
                </div>,
                <div className="w100 h-100" style={{ background: "#7FFFD4" }}>
                  第2頁
                </div>,
                <div className="w100 h-100" style={{ background: "#E9967A" }}>
                  第3頁
                </div>,
              ]}
            />
          </AnimatedShowUpComponent>
          {/* 按鈕區 */}
          <div className="col-5 mh-100 d-flex-col p-0">
            <AnimatedShowUpComponent className="w100 col-4 p-0">
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_html.svg"
                    alt="HTML Icon"
                    style={{ maxWidth: "80%" }}
                  />
                }
                textContent="HTML / CSS design"
                backgroundColor={colorEnum.warning}
                contentColor={colorEnum.primary}
                className="w100 h-100"
                onClick={() => {
                  introSlideClick(0);
                }}
              />
            </AnimatedShowUpComponent>
            <AnimatedShowUpComponent className="w100 col-4 p-0">
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_react.svg"
                    alt="img_react Icon"
                    style={{ maxWidth: "30%" }}
                  />
                }
                textContent="REACT"
                backgroundColor={colorEnum.primary}
                contentColor={colorEnum.white}
                className="w100 h-100"
                onClick={() => {
                  introSlideClick(1);
                }}
              />
            </AnimatedShowUpComponent>
            <AnimatedShowUpComponent className="w100 col-4 p-0">
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_kotlin.svg"
                    alt="img_kotlin Icon"
                    style={{ maxWidth: "30%" }}
                  />
                }
                textContent="Android / Kotlin"
                backgroundColor={colorEnum.alert}
                contentColor={colorEnum.white}
                className="w100 h-100"
                onClick={() => {
                  introSlideClick(2);
                }}
              />
            </AnimatedShowUpComponent>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}



export default IntroducePage;
