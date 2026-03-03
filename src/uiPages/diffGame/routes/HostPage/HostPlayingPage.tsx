import React, { useEffect, useState, useContext, useRef } from 'react'
import { PageState, colorType } from '../../allType'
import GameTextButton from '../../components/GameTextButton'
import GameLoading from '../../components/GameLoading'
import GameTitleBox from '../../components/GameTitleBox'
import GamePlayerCard from '../../components/GamePlayerCard'
import { Logout, NavigateNext, Visibility } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Host } from '../../api/api'
import { joinGameResItem, receiveAnsResItem } from '../../api/SignalR'
import GameTimer, { GameTimerInterface } from '../../components/GameTimer'
import { demoAnswear, fakePlayerData } from '../../fakeData'

export default function HostPlayingPage() {
    // 倒數鐘 ref
    const TimerRef = useRef<GameTimerInterface | null>(null);

    /** 遊戲 signalR */

    const [state, setState] = useState<PageState>({
        isLoaded: true,
        modalOpen: false,
        modalInner: null,
    })
    // 題目
    const [question, setQuestion] = useState<{
        questionStr: string,
        questionId: string
    }>({
        questionStr: '',
        questionId: ''
    })

    // 是否公布答案
    const [isOpen, setIsOpen] = useState<boolean>(false)

    /**@description 玩家 數量*/
    const [playerArr, setPlayerArr] = useState<(Host.searchPlayersAnsResItem & {
        isDone: boolean,
    })[]>([])

    /**@description 被選取 玩家 數量*/
    const [selectedPlayerArr, setSelectedPlayerArr] = useState<(Host.searchPlayersAnsResItem & {
        isDone: boolean,
    })[]>([])

    // #region API functions
    /** 查詢所有玩家 */
    async function searchPlayer() {
        setPlayerArr(fakePlayerData);
    }

    /** 抽新題目 */
    async function searchNewQuestion(data?: {
        gameName: string;
        gameID: string;
        gameToken: string;
    }) {
        setQuestion({
            questionId: "001",
            questionStr: "請表示出一種紅色的水果"
        })
    }

    /** 目前已進行中最新題目 
     * @description 抽新題目前先查詢目前已進行中最新題目 
     * @returns 要直接抽新題目: ture ; 目前有題目尚未完成流程: false
    */
    async function searchNewestQuestion(players: typeof playerArr) {
        setQuestion({
            questionId: "001",
            questionStr: "請表示出一種紅色的水果"
        })
    }

    /**@description 查詢玩家答案 */
    async function searchPlayersAns(qId: string, checkAnsorNot: boolean, inputPlayers?: typeof playerArr) {
        setPlayerArr(fakePlayerData.map(ele => ({
            ...ele,
            answer: demoAnswear
        })))
    }

    /** 計分 
     * @param IntergalScoreData 計分參數
    */
    async function SummarizeScore(IntergalScoreData: {
        player_id: string;
        gamequestion_id: string;
        game_id: string;
        token: string;
    }[]) {
    }

    // #endregion



    // #region click functions
    /** 下題 / 開答案 鈕 click */
    async function controllBtnClick() {
        //下一題
        if (isOpen) {
            // 進行下題
            await searchNewQuestion().then(res => {
                // 關閉答案卡
                setIsOpen(false);
                // 清空 被選擇人陣列
                setSelectedPlayerArr([])
                // 重啟計時
                if (TimerRef.current) { TimerRef.current.reStartTimer() }
            })

        }
        //開答案
        else {
            await TimerRef.current?.stopTimer()
            //查答案
            await searchPlayersAns(question.questionId, true).then(res => setIsOpen(true))
        }

    }

    /** 點擊玩家 計算分數 */
    function handlePlayerCardClick(playerItem: Host.searchPlayersAnsResItem & {
        isDone: boolean;
    }) {
        let newArr = [...selectedPlayerArr]
        //若以選取則取消選取
        if (selectedPlayerArr.some(ele => ele.player_id === playerItem.player_id)) {
            newArr = newArr.filter(ele => ele.player_id !== playerItem.player_id)
        }
        //若未選取則加入選取
        else {
            newArr.push(playerItem)
        }
        setSelectedPlayerArr(newArr)
    }

    /** 點擊結算 */
    async function handleEndGameClick() {
    }

    // #endregion

    useEffect(() => {
        searchNewQuestion()
        searchPlayer()
    }, [])

    if (state.isLoaded) {
        return <React.Fragment>
            <div className="background d-flex flex-column align-items-center gap-4">

                {/* 倒數計時器 */}
                <div className=" position-absolute start-0" style={{ top: "5%" }}>
                    <GameTimer countMin={0.5} width={150} ref={TimerRef} />
                </div>

                {/* 遊戲間標題 */}
                <div className='title-S' style={{ fontSize: '18px' }}>遊戲間: Testing Game Room  </div>

                {/* 題目 */}
                <GameTitleBox style={{ width: '60%', }} text={question.questionStr} color={colorType.yellow} />

                {/* 玩家卡片 */}
                <div className="d-flex flex-wrap justify-content-center gap-2 overflow-y-auto flex-grow-1" style={{
                    // 不要固定
                    // minHeight: '460px'
                }}>
                    {playerArr.map((item, index) => {
                        return (
                            <GamePlayerCard<{ [key: string]: any }>
                                key={item.player_id}
                                isDone={item.isDone}
                                isOpened={isOpen}
                                selected={selectedPlayerArr.some(ele => ele.player_id === item.player_id)}
                                playerItem={item}
                                playerName={item.playername}
                                changeEvent={() => {
                                    if (isOpen) {
                                        handlePlayerCardClick(item)
                                    }
                                }}
                                ansewerUrl={item.answer}
                            />
                        )
                    })}
                </div>

                {/* 操作鈕 */}
                <div className="text-center d-flex gap-2">
                    <GameTextButton text={isOpen ? <>下一題 <NavigateNext /></> : <>查看答案 <Visibility /> </>}
                        color={colorType.orange}
                        style={{ marginTop: '.5rem' }}
                        clickEvent={() => { controllBtnClick() }} />
                </div>


                {/* 結算紐 */}
                <div className="endGameBtn">
                    <GameTextButton text={<>結算 <Logout /></>}
                        color={colorType.yellow}
                        style={{ marginTop: '5rem', fontSize: '18px', minWidth: 'auto' }}
                        clickEvent={() => { handleEndGameClick() }} />

                </div>
            </div>

        </React.Fragment>
    } else {
        return <div className="background d-flex flex-column align-items-center gap-4">
            <GameLoading />
        </div>
    }
}

