import { useRef } from "react";
import useOnScreen from "../entity/useOnScreen";
import { directionEnum } from "./allEnum";

/** 依照滾動視窗漸呈現視窗效果 props */
interface AnimatedShowComponentProps {
  className?: string;
  children?: React.ReactNode;
  rootMargin?: string;
  transitionDuration?: string;
  direction?: directionEnum;
  transitionDelay?: string;
}

/** 依照滾動視窗漸呈現視窗效果 div
 * 往上移動的效果
 */
export function AnimatedShowUpComponent({
  className,
  children,
  rootMargin = "-100px",
  transitionDuration = "0.5s",
  direction = directionEnum.Up,
  transitionDelay = "ease",
}: AnimatedShowComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref, rootMargin);

  /** 依照方向產生變數 */
  function generateDirectionStr() {
    switch (direction) {
      case directionEnum.Up:
        return "translateY(-20px)";
      case directionEnum.Down:
        return "translateY(20px)";
      case directionEnum.Right:
        return "translateX(-20px)";
      case directionEnum.Left:
        return "translateX(20px)";
      default:
        return "translateY(-20px)";
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: onScreen ? 1 : 0,
        transform: onScreen ? "none" : generateDirectionStr(),
        willChange: onScreen ? "auto" : "transform, opacity",
        transition: `opacity ${transitionDuration} ${transitionDelay}, transform ${transitionDuration} ${transitionDelay}`,
      }}
    >
      {children}
    </div>
  );
}
