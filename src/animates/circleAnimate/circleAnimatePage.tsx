import React, { useEffect, useRef, useState } from "react";
import { colorEnum } from "../../components/allEnum";

interface EllipticalCircleProps {
  diameter: number;
  ellipseWidth: number;
  ellipseHeight: number;
  ellipseCount: number;
  strokeColor: colorEnum;
  strokeWidth: number;
  backgroundColor?: colorEnum;
}
export default function EllipticalCircle(props: EllipticalCircleProps) {
  const animateSVG = useRef<SVGSVGElement | null>(null);
  const {
    ellipseWidth,
    ellipseHeight,
    ellipseCount,
    strokeColor,
    strokeWidth,
    backgroundColor,
  } = props;

  const center = ellipseWidth / 2 + 20;

  /** 產生橢圓 */
  function generateEllipses() {
    const radius = ellipseWidth / 2; // 半徑
    const spacing = ellipseWidth / (ellipseCount + 1); // 每條線之間的間距
    const ellipses: React.JSX.Element[] = [];
    const lines = [];

    for (let i = 1; i <= ellipseCount; i++) {
      const distanceFromCenter = i * spacing - radius; // 從圓心到線的距離
      const chordLength =
        2 *
        Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter); // 弦長
      lines.push({
        distanceFromCenter: distanceFromCenter,
        chordLength: chordLength,
      });
    }

    lines
      .sort((a, b) => b.distanceFromCenter - a.distanceFromCenter) // 排序
      .forEach((item, index) => {
        ellipses.push(
          <ellipse
            key={index}
            cx={center}
            cy={center}
            rx={item.chordLength}
            ry={item.chordLength / 1.8}
            style={
              {
                "--translateX": index * 4 + "px",
                "--translateY": center - item.distanceFromCenter + "px",
                "--rotate": "-45deg",
                "--strokeWidth": strokeWidth,
                transform:
                  "rotate(var(--rotate)) translate(var(--translateX), var(--translateY))",
                transformOrigin: `${center}px ${center}px`,
              } as any
            }
            fill={backgroundColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      });

    return ellipses;
  }

  /** 定時動畫 */
  function setAnimateTimeOut(animationOn: boolean) {
    if (animationOn) {
      // 開始動畫
      animateSVG?.current?.classList.add("playOn");
    } else {
      // 移除動畫
      animateSVG?.current?.classList.remove("playOn");
    }
  }

  useEffect(() => {
    setAnimateTimeOut(true);
  }, []);

  // 監聽滑鼠事件
  useEffect(() => {
    const ellipseElements = animateSVG?.current?.children; // 取得所有子元素

    if (ellipseElements) {
      const handleMouseEnter = (event: Event) => {
        (event.target as SVGAElement).classList.add("selectCircle");
        setAnimateTimeOut(false);
      };

      const handleMouseLeave = (event: Event) => {
        // 在這裡處理 mouseenter 事件
        (event.target as SVGAElement).classList.remove("selectCircle");
        setAnimateTimeOut(true);
      };

      // 為每個子元素添加事件監聽器
      Array.from(ellipseElements).forEach((element) => {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      });

      // 清除事件監聽器
      return () => {
        Array.from(ellipseElements).forEach((element) => {
          element.removeEventListener("mouseenter", handleMouseEnter);
          element.removeEventListener("mouseleave", handleMouseEnter);
        });
      };
    }
  }, [animateSVG]);

  return (
    <React.Fragment>
      <svg
        ref={animateSVG}
        className="animateCircel playOn"
        width={"80%"}
        height={"80%"}
        viewBox={`0 0 ${ellipseWidth * 2} ${ellipseHeight * 2}`}
        style={{ "--ellipseCount": ellipseCount } as any}
      >
        {generateEllipses()}
      </svg>
    </React.Fragment>
  );
}
