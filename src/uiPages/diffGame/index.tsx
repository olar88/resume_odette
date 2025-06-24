import React, { useState } from "react";
import { AnimatedShowUpComponent } from "../../components/AnimatedShowUpComponent";
import Sliders from "../../components/sliders";
import { useScrollDirection } from "../../entity/useScrollDirection";
import './css/gameCSS.css';
import HostHomePage from "./routes/HostPage/HostHomePage";
import HostWaitPage from "./routes/HostPage/HostWaitPage";
import HostPlayingPage from "./routes/HostPage/HostPlayingPage";
import HostAwardsPage from "./routes/HostPage/HostAwardsPage";
import PlayerHomePage from "./routes/PlayerPage/PlayerHomePage";
import PlayerPlayingPage from "./routes/PlayerPage/PlayerPlayingPage";
import { useNavigate } from "react-router-dom";
import BackIcon from "../../svg/img_back";

/** 遊戲介紹主頁 */
function GameDiffIndexPage() {
  const [activeNow, setActiveNow] = useState(0);
  const navigate = useNavigate()

  useScrollDirection((direction) => {
    pageScroll(direction === "up" ? -1 : 1)
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

  function handleClick(int: number) {
    setActiveNow(int)
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
                return <div key={step.name + index}
                  onClick={() => { handleClick(index) }}
                  className={"gameStepBox " + (index === activeNow ? "active" : "")}>{step.name}</div>
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
      <div className="iconBtn position-absolute end-0 top-0" style={{ width: "45px" }} onClick={() => {
        navigate("/")
      }}>
        <BackIcon className=" w-100" />
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
    name: "主持 - 開啟遊戲新局",
    content: <HostHomePage nowStep="new" />
  },
  {
    name: "主持 - 等待遊玩玩家進入",
    content: <HostWaitPage />
  },
  {
    name: "主持 - 進行遊戲",
    content: <HostPlayingPage />
  },
  {
    name: "主持 - 結束遊戲",
    content: <HostAwardsPage />
  },
  {
    name: "PC 玩家 - 選擇遊戲",
    content: <div className="mobileBackground" style={{ height: "90%" }}><PlayerHomePage setBackBtn={() => { }} Mobiledevice={false} /></div>
  },
  {
    name: "PC 玩家 - 進行遊戲(等待中)",
    content: <div className="mobileBackground" style={{ height: "90%" }}><PlayerPlayingPage setBackBtn={() => { }} Mobiledevice={false} /></div>
  },
  {
    name: "PC 玩家 - 進行遊戲(遊戲中)",
    content: <div className="mobileBackground" style={{ height: "90%" }}><PlayerPlayingPage setBackBtn={() => { }} Mobiledevice={false} isLoaded={true} /></div>
  },
  {
    name: "MB 玩家 - 進行遊戲(等待中)",
    content: <div className="mobileBackground position-absolute start-50 translate-middle-x overflow-hidden" style={{ aspectRatio: "0.6", width: "auto", height: "90%" }}> <PlayerPlayingPage setBackBtn={() => { }} Mobiledevice={true} /></div>
  },
  {
    name: "MB 玩家 - 進行遊戲(遊戲中)",
    content: <div className="mobileBackground position-absolute start-50 translate-middle-x  overflow-hidden" style={{ aspectRatio: "0.6", width: "auto", height: "90%" }}><PlayerPlayingPage setBackBtn={() => { }} Mobiledevice={true} isLoaded={true} /></div>
  },
]

export default GameDiffIndexPage;
