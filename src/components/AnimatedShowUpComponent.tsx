import { useRef } from "react";
import useOnScreen from "../hooks/useOnScreen";

/** 依照滾動視窗漸呈現視窗效果 props */
interface AnimatedShowUpComponentProps {
  className?: string;
  children?: React.ReactNode;
  rootMargin?: string;
  transitionDuration?: string;
}

/** 依照滾動視窗漸呈現視窗效果 div */
export default function AnimatedShowUpComponent({
  className,
  children,
  rootMargin = "-100px",
  transitionDuration = "0.5s",
}: AnimatedShowUpComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref, rootMargin);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: onScreen ? 1 : 0.1,
        transform: onScreen ? "none" : "translateY(-20px)",
        willChange: onScreen ? "auto" : "transform, opacity",
        transition: `opacity ${transitionDuration} ease, transform ${transitionDuration} ease`,
      }}
    >
      {children}
    </div>
  );
}