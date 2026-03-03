import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from 'd3';
// 定義 Field 類型，代表計時器的狀態
interface Field {
    value: number;
    size: number;
    update: () => number;
    previous?: number;
}

/** 倒數計時鐘 ref 本體 */
export interface GameTimerInterface {
    /** 停止 計時 */
    stopTimer: () => Promise<void>,
    /** 重新 計時 */
    reStartTimer: () => Promise<void>,
}

/** 倒數計時鐘 props */
export type GameTimerProps = {
    /** 倒數起始分鐘 */
    countMin?: number;
    /** 寬度 (比例為1:1) */
    width: number;
    /** 倒數結束事件 */
    onTimeUp?: Function
}

/** 倒數計時鐘 */
const GameTimer = forwardRef<GameTimerInterface, GameTimerProps>((props, ref) => {
    const [currentTimeSec, setCurrentTimeSec] = useState<number>(props.countMin ? props.countMin * 60 : 60)
    const [foregroundArcValue, setForegroundArcValue] = useState<string | null>(null)
    const intervalIdRef = useRef<NodeJS.Timer | null>(null);
    /** 使用 useRef 創建對 path 的引用 */
    const pathRef = useRef<SVGPathElement | null>(null);

    // 使用 D3.js 來計算扇形的路徑
    const arc = d3.arc<Field>()
        .innerRadius((d) => props.width / 3 - props.width * .12)
        .outerRadius((d) => props.width / 3 - props.width * .02)
        .startAngle(0)
        .endAngle((d) => ((d.value / d.size) * 2 * Math.PI));

    /** 註冊倒數事件 */
    function countDownFunction() {
        intervalIdRef.current = setInterval(() => {
            setCurrentTimeSec(prev => {
                const updatedTime = prev > 0 ? prev - 1 : prev
                if (updatedTime === 0) {
                    // 執行倒數結束事件
                    if (props.onTimeUp) { props.onTimeUp() }
                    clearInterval(intervalIdRef.current!);
                }
                return updatedTime
            })
        }, 1000)
    }

    const arcTween = (b: Field) => {
        const i = d3.interpolate({ value: b.previous || 0 }, b);
        return (t: number) => {
            const interpolated = i(t);
            const updatedArc = arc(interpolated) as any;
            return isNaN(updatedArc) ? arc({
                value: currentTimeSec,
                size: props.countMin ? props.countMin * 60 : 10,
                update: () => currentTimeSec,
            }) : updatedArc;
        };
    };

    /** 前景圓環的更新函數*/
    const updateForegroundArc = () => {
        // 透過 D3.js 生成的扇形路徑
        let newArc = arc({
            value: currentTimeSec + .2,
            size: props.countMin ? props.countMin * 60 : 10,
            update: () => currentTimeSec,
        })
        // 若找的到前景環 ref
        if (pathRef.current) {
            const transition = d3.transition().ease(d3.easeElastic).duration(500);
            d3.select(pathRef.current)
                .transition(transition)
                .attr('d', arcTween(newArc as any) as any); // 直接使用 attr 設定動畫
        }
        setForegroundArcValue(newArc);
    };

    /** 丟出重設倒數時間功能*/
    useImperativeHandle(ref, () => ({
        stopTimer: async () => {
            setCurrentTimeSec(0)
        },
        reStartTimer: async () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
            setCurrentTimeSec(props.countMin ? props.countMin * 60 : 60);
            countDownFunction();
        },
    }));

    // 初始化即註冊倒數事件
    useEffect(() => {
        countDownFunction();
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [])

    // 在 currentTimeSec 更改時，觸發前景圓環的更新
    useEffect(() => {
        updateForegroundArc();
    }, [currentTimeSec]);

    return <React.Fragment>
        <div className="gameTimerContainer" style={{ width: props.width + 'px' }}>
            <svg width={props.width} height={props.width}>
                <g style={{ transform: `translate(${props.width / 2}px, ${props.width / 2}px)` }} className="field">
                    {/* 背景圓環 */}
                    <path
                        className='path path--background'
                        d={arc({
                            value: props.width,
                            size: props.width,
                            update: () => props.width,
                        }) || ''}>
                    </path>

                    {/* 前景圓環，使用 D3.js 計算的扇形路徑 */}
                    <path
                        ref={pathRef}
                        className='path path--foreground'
                        d={foregroundArcValue || ''}
                    // style={{ transition: 'd 1s ease-in-out' }}
                    >
                    </path>

                    {/* 倒數時間字 */}
                    <text className={"label " + (currentTimeSec > 10
                        ? ''
                        : currentTimeSec !== 0
                            ? 'pulse'
                            : 'timesUp')}
                        style={{ transform: `translate(0, ${currentTimeSec > 60 ? 5 : 8}%)`, fontSize: props.width / 130 * (currentTimeSec > 60 ? 1 : 2) + 'rem' }}>

                        {currentTimeSec > 60
                            ? (Math.floor(currentTimeSec / 60) + ':' + ((currentTimeSec % 60 >= 10) ? currentTimeSec % 60 : '0' + (currentTimeSec % 60)))
                            : currentTimeSec
                        }
                    </text>
                </g>
            </svg>
        </div>
    </React.Fragment >
})


export default GameTimer