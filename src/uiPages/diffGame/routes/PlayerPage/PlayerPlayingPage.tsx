import React, { useEffect, useState, useRef, useContext } from "react";
import { PageState, colorType } from "../../allType";
import GameIconButton from "../../components/GameIconButton";
import { MeetingRoom, ScreenRotation, SportsEsports } from "@mui/icons-material";
import GameLoading from "../../components/GameLoading";
import { fabric } from 'fabric';
import { useNavigate } from "react-router-dom";
import { Host, Player } from "../../api/api";
import { GameAlertResult } from "../../components/GameAlertResult";
import GameTextButton from "../../components/GameTextButton";
import { GameModal } from "../../components/GameModal";
import { WinResItem, joinGameResItem, nextQuestionResItem } from "../../api/SignalR";
import GameMedal from "../../components/GameMedal";

function PlayerPlayingPage(props: {
    setBackBtn: React.Dispatch<React.SetStateAction<{
        event: Function;
        show: boolean;
    }>>,
    Mobiledevice: boolean,

}) {

    const navigate = useNavigate()
    const canvasHTMLRef = useRef<HTMLCanvasElement | null>(null);

    /** 手機是否橫向 */
    const [isRotate, setIsRotate] = useState<boolean>(false)

    /** */
    const [state, setState] = useState<PageState & {
        /** 遊戲是否已結束 */
        isEndTheGame: boolean,
        /** 房間是否已開啟新局 */
        isRenewTheGame: boolean,
        /** 是否為贏家 (1 2 3名次) */
        isTheWinner: number
    }>({
        isLoaded: false, //暫時
        isSend: false,
        modalOpen: false,
        modalInner: null,
        isEndTheGame: false,
        isRenewTheGame: false,
        isTheWinner: 0,
    })

    const [questionId, setQuestionId] = useState<string>('')

    const [waitingStr, setWaitngStr] = useState<string>('登入成功 ! 等待遊戲開始')

    const canvasRef = useRef<fabric.Canvas | null>(null);

    // #region pure function
    /** 判斷手機是否橫向 */
    function handleOrientationChange() {
        // 確定還在作答時間中改變螢幕比例
        if (state.isLoaded &&
            !state.isEndTheGame) {
            if (!!canvasRef.current) {
                setState((prev) => ({ ...prev, isLoaded: false }))

                // 從 DOM 中删除舊的 canvas 元素
                canvasRef.current.dispose();
                setTimeout(() => {
                    setState(prev => ({ ...prev, isLoaded: true }))
                }, 50)
            }
        }
        if (window.innerWidth > window.innerHeight) {
            setIsRotate(true)
            // console.log('螢幕為橫向模式');
        } else {
            setIsRotate(false)
            // console.log('螢幕為縱向模式');
        }
    }

    /** 判斷重新連線 */
    async function ConnectedOrNot(reconnect?: boolean) {
        if (reconnect) {
            // 該房間已關閉
            window.confirm('Opps 該遊戲間已結束! ,請回首頁')
            leaveGameClick()
        } else {
            setWaitngStr('登入成功 ! 請等待下題遊戲開始')
        }
    }

    // #endregion

    // #region canvas function
    /** 繪製 canvas */
    const drawingCanvas = () => {
        if (canvasHTMLRef.current) {
            // 初始化Canvas
            const canvas = new fabric.Canvas(canvasHTMLRef.current, {
                // 設置Canvas寬度
                width: 225 * (isRotate ? 2.8 : 1.5),

                // 設置Canvas高度
                height: 106 * (isRotate ? 2.8 : 1.5),

                // 設置Canvas背景色
                backgroundColor: '#1F4B52',

            });

            // 添加事件監聽器，以便繪製
            if (canvas) {
                canvas.isDrawingMode = true;
            }

            // 設置繪製筆刷的顏色和寬度
            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = '#fff';
                canvas.freeDrawingBrush.width = 5;
            }
            canvasRef.current = canvas
        }
    }

    /** 清除 canvas 內容 */
    const clearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clear()
            canvasRef.current.backgroundColor = '#1F4B52'
            canvasRef.current.isDrawingMode = true
        }
    }

    /** 確定送出 canvas 內容 */
    const confirmCanvas = async () => {
        if (canvasRef.current) {
            // 鎖定不開放修改
            canvasRef.current.isDrawingMode = false
            // 鎖定 Canvas 上的所有對象
            canvasRef.current.forEachObject((obj) => {
                obj.set({ selectable: false });
            });

            /**@description 轉成 base64 */
            let AnsUrl = canvasRef.current.toDataURL()
            //送出答案
            // 將按鈕皆鎖住
            setState((prev) => ({ ...prev, isSend: true }))
        }
    }

    // #endregion 

    /** 確定離開遊戲 */
    async function leaveGameClick() {
    }

    useEffect(() => { //判斷重新連線
        ConnectedOrNot()
    }, [])

    useEffect(() => {

        // 檢查方向
        handleOrientationChange();

        // 添加resize事件監聽器
        window.addEventListener('resize', handleOrientationChange);
        return () => {
            window.removeEventListener('resize', handleOrientationChange)
        }
    }, [])

    useEffect(() => {
        props.setBackBtn(prev => ({
            ...prev,
            event: () => {
                setState(prev => ({
                    ...prev,
                    modalOpen: true,
                    modalInner: {
                        id: 'leaveModalInner',
                        title: '離開遊戲',
                        modalInner: <ModalLeaveInner />,
                        modalAction: () => leaveGameClick(),
                        size: 'medium'
                    }
                }))
            },
            show: !props.Mobiledevice
        }))
    }, [props.Mobiledevice])

    useEffect(() => { if (state.isLoaded) drawingCanvas() }, [state.isLoaded])
    return <React.Fragment>
        {state.isLoaded
            // 遊戲區 
            ? state.isEndTheGame
                // 判斷遊戲已結束 
                ? <React.Fragment>
                    <div className="drawingBox" style={{ paddingTop: isRotate ? "60px" : "15px" }}>
                        <div className="mobileTitle mb-1">
                            <div className='title-S '><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                        </div>
                        {state.isTheWinner > 0
                            ? <>
                                <GameMedal name={state.isTheWinner} className="small"
                                    color={state.isTheWinner === 1
                                        ? 'gold'
                                        : state.isTheWinner === 2
                                            ? 'silver'
                                            : 'cooper'} />
                                <GameAlertResult mainText={'Congratulations'} minorText={'您獲得了第 1 名'} />
                            </>
                            : <GameAlertResult mainText="Game Over" minorText="遊戲已結束" />
                        }

                        <div className="d-flex w-100 justify-content-between mt-3 mb-3">
                            <div className="text-center">
                                <GameTextButton
                                    id='join_a_game_btn'
                                    text={<><MeetingRoom fontSize='small' />離開</>}
                                    color={colorType.orange}
                                    clickEvent={() => leaveGameClick()}
                                />
                            </div>

                            <div className="text-center">
                                {/* // SIGNLR 判斷該遊戲是否已被重啟 */}
                                {state.isRenewTheGame
                                    ? <GameTextButton
                                        id='start_new_game_btn'
                                        text={<><SportsEsports fontSize='small' />繼續遊戲</>}
                                        color={colorType.yellow}
                                        clickEvent={() => {
                                            setState(prev => ({
                                                ...prev,
                                                isLoaded: false,
                                                isEndTheGame: false,
                                                isTheWinner: 0,
                                                isRenewTheGame: false,
                                                isSend: false
                                            }))
                                        }}
                                    />
                                    : null}
                            </div>
                        </div>
                    </div>
                </React.Fragment>

                // 判斷遊戲未結束 
                : <React.Fragment>
                    <div className="drawingBox" style={{ paddingTop: isRotate ? "60px" : "15px" }}>
                        <div className="mobileTitle mb-4">
                            <div className='title-Max '><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                            <div className='title-Max ' style={{ fontSize: '.85rem' }}>請寫下您的答案</div>
                        </div>
                        <canvas ref={canvasHTMLRef} />

                        {state.isSend
                            ? <div id="waitTitle"
                                className='title-Max mt-3'
                                style={{ fontSize: '.9rem', color: '#FF8D66' }}
                            >
                                成功送出答案！等待本局計分中．．．
                            </div>
                            : <div className="d-flex">
                                <GameIconButton
                                    id={'clear_btn'}
                                    color={colorType.greenRelaod}
                                    clickEvent={() => { clearCanvas() }} />
                                <GameIconButton
                                    id={'send_btn'}
                                    color={colorType.orange}
                                    clickEvent={() => { confirmCanvas() }} />
                            </div>
                        }

                    </div>
                    <div className="mobileTitle mb-4 mt-5">
                        <div className='title-Max ' style={{ fontSize: '.85rem', color: '#5DADAA' }}>{isRotate ? "" : <><ScreenRotation className="animate__animated animate__swing animate__slow animate__infinite" /><br />請將手機橫向以更盡情的進行遊戲</>} </div>
                    </div>
                </React.Fragment>

            // 等待區 
            : <React.Fragment>
                <div className="mobileTitle mb-4">
                    <div className='title-Max ' style={{ fontSize: '.85rem', color: '#5DADAA' }}>
                        {isRotate
                            ? ""
                            : <><ScreenRotation className="animate__animated animate__swing animate__slow animate__infinite" /><br />請將手機橫向以更盡情的進行遊戲</>
                        }
                    </div>
                </div>
                <GameLoading />
                {/* 等待提示字元 */}
                <div id="waitTitle" className='title-Max position-absolute start-50 translate-middle' style={{ fontSize: '.9rem', color: '#5DADAA', top: '80%' }}>{waitingStr}</div>

            </React.Fragment>
        }
        <GameModal
            modalOpen={state.modalOpen}
            modalInner={state.modalInner}
            closeFnc={() => { setState(prev => ({ ...prev, modalOpen: false })) }}
        />
    </React.Fragment>
}

/**@description 確定要離開modal */
export function ModalLeaveInner(props: {

}) {
    return <div className='title-Max mb-3' style={{ fontSize: '1.2rem', color: 'var(--dark_Or)' }}>
        確定要離開遊戲?
    </div>
}

export default (PlayerPlayingPage)