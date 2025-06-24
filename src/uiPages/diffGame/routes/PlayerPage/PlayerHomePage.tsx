import React, { useContext, useEffect, useState } from "react";
import GameTextButton from "../../components/GameTextButton";
import { PageState, colorType } from "../../allType";
import { useNavigate } from "react-router-dom";
import { Player } from "../../api/api";
import GameLoading from "../../components/GameLoading";
import GameInput from "../../components/GameInput";
import GameIconButton from "../../components/GameIconButton";
import { GameAlertResult } from "../../components/GameAlertResult";
import { newRoomResItem } from "../../api/SignalR";
import { fakeGameRoomData } from "../../fakeData";

export default function PlayerHomePage(props: {
    setBackBtn: React.Dispatch<React.SetStateAction<{
        event: Function;
        show: boolean;
    }>>,
    Mobiledevice: boolean,
}) {
    const navigate = useNavigate()

    /** 遊戲 signalR */

    const [state, setState] = useState<PageState>({
        isLoaded: true,
        modalOpen: false,
        modalInner: null,
    })
    // 遊戲房間結果
    const [resDArr, setResDArr] = useState<Player.GameRoomSearchResItem[]>([])

    // 加入遊戲參數
    const [joinGameData, setJoinGameData] = useState<{
        game_id: string,
        playername: string,
        player_id: string | null,
        token: string,
    }>({
        game_id: '',
        playername: '',
        player_id: '',
        token: ''
    })

    /** 查詢遊戲間 */
    async function searchGameRoom() {
        setResDArr(fakeGameRoomData)
    }

    /** 點擊進入遊戲間 */
    async function handleClickGameRoom() {
    }

    useEffect(() => {
        searchGameRoom();
    }, [])

    if (state.isLoaded) {
        if (!!joinGameData.game_id) {
            return <React.Fragment>
                <div className="allPage ">
                    <div className="mobileTitle mb-4">
                        <div className='title-Max mt-2' style={{ fontSize: '.95rem' }}>Join a </div>
                        <div className='title-Max '><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                        <div className='title-Max ' style={{ fontSize: '.85rem' }}>請輸入您遊玩時的稱號 </div>
                    </div>
                    <div className="signInBox" >
                        <GameInput
                            value={joinGameData.playername}
                            placeholder={'請輸入綽號'}
                            color={colorType.orange}
                            changeEvent={(e) => { setJoinGameData(prev => ({ ...prev, playername: e.target.value })) }}
                        />
                        <GameIconButton color={colorType.orange} clickEvent={() => {
                            handleClickGameRoom()
                        }} />
                    </div>
                </div>
            </React.Fragment>
        } else {
            return <React.Fragment>
                <div className="allPage ">
                    <div className="mobileTitle mb-4">
                        <div className='title-Max mt-2' style={{ fontSize: '.95rem' }}>Join a </div>
                        <div className='title-Max '><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                        <div className='title-Max ' style={{ fontSize: '.85rem' }}>點擊進入遊戲房 </div>
                    </div>

                    <div className="roomList">
                        {resDArr.length
                            ? resDArr.map((item, index) => (
                                <GameTextButton key={item.game_id}
                                    text={<><svg fill="#804600" width={25} height={25} viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#804600"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M200,40V224H56V40a7.99989,7.99989,0,0,1,8-8H192A7.99989,7.99989,0,0,1,200,40Z" opacity="0.2"></path> <path d="M232,216H208V40a16.01833,16.01833,0,0,0-16-16H64A16.01833,16.01833,0,0,0,48,40V216H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16ZM64,40H192V216H64Zm104,88a12,12,0,1,1-12-12A12,12,0,0,1,168,128Z"></path> </g></svg>
                                        {item.gamename}</>}
                                    border={true}
                                    clickEvent={() => {
                                        setJoinGameData(prev => ({
                                            ...prev,
                                            game_id: item.game_id,
                                            token: item.token
                                        }))
                                    }}
                                    color={colorType.yellow} />
                            ))
                            : <GameAlertResult mainText="Opps !" minorText="尚未有可加入遊戲間" />
                        }
                    </div>



                </div>
            </React.Fragment>
        }
    } else return <GameLoading />

}