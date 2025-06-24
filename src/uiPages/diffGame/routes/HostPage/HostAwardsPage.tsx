import React, { useEffect, useState } from 'react'
import { PageState, colorType } from '../../allType'
import GameTextButton from '../../components/GameTextButton'
import GameLoading from '../../components/GameLoading'
import GameTitleBox from '../../components/GameTitleBox'
import { useNavigate } from 'react-router-dom'
import GameMedal from '../../components/GameMedal'
import GameStarFalls from '../../components/GameStarFalls'
import { Host } from '../../api/api'
import { GameModal } from '../../components/GameModal'
import { DisabledByDefault } from '@mui/icons-material'
import { fakePlayerData } from '../../fakeData'

export default function HostAwardsPage() {
    const nevigate = useNavigate()

    const [state, setState] = useState<PageState>({
        isLoaded: false,
        modalOpen: false,
        modalInner: null,
    })

    const [resRankArr, setResRankArr] = useState<Host.RankSearchResItem[]>([])

    /**@description 查詢排行 */
    async function searchRank() {
        /**@description 分數由大至小排序 */
        let resData = fakePlayerData.sort((a, b) => { return parseInt(b.playertotalscore) - parseInt(a.playertotalscore) })
        setResRankArr(resData)
        setState(prev => ({ ...prev, isLoaded: true }))
    }

    /**@description 開啟新局 */
    async function reStartClick() {
    }

    /**@description 結束遊戲 click */
    async function endGameClick() {
        setState(prev => ({
            ...prev,
            modalOpen: true,
            modalInner: {
                id: "endGame",
                title: "結束遊戲",
                modalInner: <ModalEndGame
                    gameName={"Testing Game Room"}
                />,
                modalAction: () => endGameConfirm(),
                size: 'medium'
            }
        }))
    }

    /**@description 結束遊戲 確認 */
    async function endGameConfirm() {
    }

    useEffect(() => {
        searchRank()
    }, [])

    if (state.isLoaded) {
        return <React.Fragment>
            <div className="background">
                {/* 星星 */}
                <GameStarFalls />

                {/* 標題 */}
                <div className="text-center d-flex gap-2 mt-4  justify-content-center">
                    <GameTitleBox className='mt-4' style={{ width: '60%', height: '80px' }} text={'頒獎時間'} color={colorType.yellow} />
                </div>

                {/* 玩家獎牌 */}
                <div className="d-flex justify-content-center gap-4 mt-4">
                    {resRankArr[2]
                        ? <GameMedal name={resRankArr[2].playername} color={'cooper'} />
                        : null}
                    {resRankArr[0]
                        ? <GameMedal name={resRankArr[0].playername} color={'gold'} className={'animate__animated'} />
                        : null}
                    {resRankArr[1]
                        ? <GameMedal name={resRankArr[1].playername} color={'silver'} />
                        : null}

                </div>

                {/* 操作鈕 */}
                <div className="text-center d-flex gap-3 mt-4 mb-4 justify-content-center">
                    <GameTextButton text={<>End Game</>} color={colorType.green} style={{ marginTop: '5rem' }} clickEvent={endGameClick} />
                    <GameTextButton text={<>Restart Game</>} color={colorType.orange} style={{ marginTop: '5rem' }} clickEvent={reStartClick} />
                </div>
            </div>

            <GameModal
                modalOpen={state.modalOpen}
                modalInner={state.modalInner}
                closeFnc={() => { setState(prev => ({ ...prev, modalOpen: false })) }}
            />
        </React.Fragment>
    } else {
        return <GameLoading />
    }
}

/**@description 確定結束遊戲 modal */
function ModalEndGame(props: {
    gameName: string
}) {
    return <React.Fragment>
        <div className="text-center h-100">
            <div className='title-Max' style={{ fontSize: '1.1em' }}>確定要結束遊戲間
                &nbsp;
                <span style={{ color: 'var(--dark_Or)' }}>{props.gameName}</span>
                &nbsp;
                ?</div>
        </div>
    </React.Fragment>


}