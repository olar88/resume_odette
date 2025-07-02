import React, { useEffect, useRef } from "react";
import { colorEnum } from "./allEnum";

/** 卡片型按鍵 */
function SquareCardButton(props: {
  mainContent: React.ReactNode;
  textContent: string;
  backgroundColor: colorEnum;
  contentColor: colorEnum;
  className?: string;
  onClick?: () => void;
}) {
  const cardButtonRef = useRef<HTMLDivElement>(null);

  /** 加上動畫 class */
  async function animateClick() {
    const element = cardButtonRef.current;
    if (element) {
      await removeAnimate(element);
      element.classList.add("whiteMaskSheet");
    }
  }

  /** 移除動畫並強制 Reflow */
  async function removeAnimate(element: HTMLDivElement) {
    if (element.classList.contains("whiteMaskSheet")) {
      element.classList.remove("whiteMaskSheet");

      // 強制 Reflow：讓瀏覽器重新計算樣式
      // 讀取 offsetWidth 會強制觸發瀏覽器重新渲染
      void element.offsetWidth;

      // 這裡可以 return Promise.resolve() 讓 function 可 await
      return Promise.resolve();
    } else {
      // 如果 class 本來就不存在，還是要 return 一個 Promise
      return Promise.resolve();
    }
  }

  return (
    <React.Fragment>
      <div
        ref={cardButtonRef}
        className={
          "d-flex-col jc-end ai-start p-3 hover_scaleY hover-point " +
          (props.className ?? "")
        }
        style={{ backgroundColor: props.backgroundColor }}
        onClick={() => {
          animateClick();
          if (props.onClick) props.onClick();
        }}
      >
        {props.mainContent}

        <div
          className="dash_bar"
          style={{ borderColor: props.contentColor }}
        ></div>

        <div className="" style={{ color: props.contentColor }}>
          {props.textContent}
        </div>
      </div>
    </React.Fragment>
  );
}

export default SquareCardButton;
