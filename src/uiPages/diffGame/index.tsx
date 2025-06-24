import React, { useState } from "react";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";
import Sliders from "../../components/sliders";
import { useScrollDirection } from "../../entity/useScrollDirection";
import './css/gameCSS.css';
import HostHomePage from "./routes/HostPage/HostHomePage";
import HostWaitPage from "./routes/HostPage/HostWaitPage";

/** 遊戲介紹主頁 */
function GameDiffIndexPage() {
  const [activeNow, setActiveNow] = useState(0);

  useScrollDirection((direction) => {
    pageScroll(direction === "up" ? 1 : -1)
  }, 500);

  function pageScroll(int: number) {
    setActiveNow(prev => {
      if (prev + int < 0 || prev + int > (allStep.length - 1)) {
        return prev
      } else {
        return prev + int
      }
    })
  }

  return (
    <React.Fragment>
      <div className="bg_light w100 h100 d-flex-col jc-center ai-center overflow-hidden">
        <div className="container row h-100 p-3">
          {/* TODO slide 頁面 */}
          {/* 步驟簡介區 */}
          <div className="col-3 h-100  p-0 overflow-y-hidden mt-auto mb-2 position-relative">
            <div className="d-flex-col stepCotainer" style={{ transform: `translateY(${activeNow * -45}px)` }}>
              {allStep.map((step, index) => {
                return <div key={step.name + index} className={"gameStepBox " + (index === activeNow ? "active" : "")}>{step.name}</div>
              })}
            </div>
          </div>
          {/* 動畫區 */}
          <AnimatedShowUpComponent className="col-9 h-100 mh-100 p-0">
            <Sliders
              activeIndex={activeNow}
              component={allStep.map(ele => {
                return <div className="w100 h-100">
                  {ele.content}
                </div>
              })}
            />
          </AnimatedShowUpComponent>

        </div>
      </div>
    </React.Fragment>
  );
}

interface gameStepType {
  name: string,
  content: React.ReactNode
}

const allStep: gameStepType[] = [
  {
    name: "首頁",
    content: <HostHomePage nowStep="home" />
  },
  {
    name: "主持遊戲新局",
    content: <HostHomePage nowStep="new" />
  }
  , {
    name: "等待遊玩玩家進入",
    content: <HostWaitPage />
  }
]

export default GameDiffIndexPage;
