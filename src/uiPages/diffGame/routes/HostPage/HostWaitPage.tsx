import React, { useEffect, useState, useContext } from 'react'
import { PageState, colorType } from '../../allType'
import GameTextButton from '../../components/GameTextButton'
import QRCode from 'react-qr-code'
import GameLoading from '../../components/GameLoading'
import GamePlayerNameCard from '../../components/GamePlayerNameCard'
import { GameAlertResult } from '../../components/GameAlertResult'
import { joinGameResItem, } from '../../api/SignalR'
import { fakePlayerData } from '../../fakeData'


export default function HostWaitPage() {
    const [state, setState] = useState<PageState>({
        isLoaded: false,
        modalOpen: false,
        modalInner: null,
    })

    const [playerArr, setPlayerArr] = useState<joinGameResItem[]>([])

    /** 查詢所有玩家 */
    async function searchPlayer() {
        setPlayerArr(fakePlayerData.map(ele => ({
            game_id: "001",
            gamename: "",
            player_id: ele.player_id,
            playername: ele.playername,
            token: ele.token,
        })));
    }

    useEffect(() => {
        setState(prev => ({ ...prev, isLoaded: true }))
        searchPlayer()
    }, [])

    return <div className="background">
        {(state.isLoaded)
            ? <React.Fragment>
                <div className='title-S mt-4' style={{ fontSize: '18px' }}>請掃描下方QR code 進入遊戲房 </div>
                <div className="title-S mt-4">「 Testing Game Room 」</div>
                <div className="w-100 d-flex justify-content-center mt-4">
                    <div className="Game_QRcode">
                        <QRCode
                            className="Game_QRcode"
                            size={200}
                            fgColor="#1F4B52"
                            bgColor='#ffffff00'
                            style={{ cursor: "pointer" }}
                            value={"Testing qrcode url"}
                            onClick={() => { }}
                        />
                    </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-4">
                    {playerArr.length
                        ? playerArr.map((playerItem, index) => (
                            <GamePlayerNameCard key={playerItem.player_id}
                                color={parseInt(playerItem.player_id) % 7 % 2 == 0 ? colorType.orange : colorType.green}
                                text={playerItem.playername}
                            />
                        ))
                        : <GameAlertResult mainText="Waiting..." minorText="尚未有玩家加入本遊戲" />
                    }

                </div>
                <div className="text-center mt-4 mb-4">
                    <GameTextButton text='開始遊戲' color={colorType.orange} clickEvent={() => { }} />
                </div>
            </React.Fragment>
            : <GameLoading />
        }

    </div>
}