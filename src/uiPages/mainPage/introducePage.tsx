import React, { RefObject, useEffect, useRef, useState } from "react";
import { colorEnum, directionEnum } from "../../components/allEnum";
import SquareCardButton from "../../components/SquareCardButton";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";

function IntroducePage() {
  const [activeNow, setActiveNow] = useState(0);

  function introSlideClick(indx: number) {
    setActiveNow(indx);
  }

  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center">
        <div className="container row min-height-50">
          {/* 動畫區 */}
          <AnimatedShowUpComponent
            className="col-7 h-100 p-0"
          >
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
          <div className="col-5 h-100 d-flex-col p-0">
            <AnimatedShowUpComponent
              className="w100 h-100 flex-grow-1 p-0"
            >
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_html.svg"
                    alt="HTML Icon"
                    style={{ minHeight: "50%", maxWidth: "100%" }}
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
            <AnimatedShowUpComponent className="w100 h-100 flex-grow-1 p-0">
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_react.svg"
                    alt="img_react Icon"
                    style={{ minHeight: "50%", maxWidth: "100%" }}
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
            <AnimatedShowUpComponent className="w100 h-100 flex-grow-1 p-0">
              <SquareCardButton
                mainContent={
                  <img
                    className="flex-grow-1 m-auto"
                    src="/svg/img_kotlin.svg"
                    alt="img_kotlin Icon"
                    style={{ minHeight: "50%", maxWidth: "100%" }}
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

function Sliders(props: { component: React.ReactNode[]; activeIndex: number }) {
  const [displayedNumber, setDisplayedNumber] = useState(props.activeIndex);
  const [leavingNumber, setLeavingNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (props.activeIndex !== displayedNumber) {
      console.log("開始動畫流程");
      setIsAnimating(true);
      setLeavingNumber(displayedNumber);
      setDisplayedNumber(props.activeIndex);
    }
  }, [props.activeIndex, displayedNumber]);

  return (
    <div className="viewBox">
      {props.component.map((ele, index) => {
        // 是否為當前滑入的 slide
        const isActive = index === props.activeIndex;
        // 是否為正在離開的 slide
        const isLeaving = index === leavingNumber;

        let className = "slide-item";

        if (isActive && isAnimating) {
          className += " slide-item-enter";
        } else if (isLeaving && isAnimating) {
          className += " slide-item-leave";
        } else if (isActive) {
          className += " active";
        }

        return (
          <div
            key={index}
            className={className}
            onAnimationEnd={(e) => {
              console.log("onAnimationEnd  isAnimating?", isAnimating);
              setLeavingNumber(null);
              setIsAnimating(false);
              console.log("動畫結束後移除");
            }}
          >
            {ele}
          </div>
        );
      })}
    </div>
  );
}

export default IntroducePage;
