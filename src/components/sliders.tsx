import { useEffect, useState } from "react";

export default function Sliders(props: { component: React.ReactNode[]; activeIndex: number }) {
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