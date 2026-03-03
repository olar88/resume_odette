import React, { useState, useEffect } from 'react'
import GamePlayerNameCard from './GamePlayerNameCard'
import { colorType } from '../allType'
import GameLoading from './GameLoading'
import { RankSearchResItem } from '../api/Host'
import { fakePlayerData } from '../fakeData'


export default function GamePlayerRank(props: {

}) {
    const [isSearched, setIsSearched] = useState<boolean>(false)

    const [isShow, setIsShow] = useState<Boolean>(false)
    const [playerArr, setPlayerArr] = useState<RankSearchResItem[]>([])

    /**@description 點擊開啟玩家排行榜 */
    async function rankClick() {
        setIsShow(prev => !prev)
        setPlayerArr(fakePlayerData)
    }
    return <React.Fragment>
        <div className={isShow ? 'playerRankBtn hidden' : 'playerRankBtn'}
            onClick={rankClick}
        >
            <svg
                width='40px'
                height='40px'
                viewBox="0 0 32 32"
                id="svg5"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth={0}></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <defs id="defs2"></defs>
                    <g id="layer1" transform="translate(-12,-100)">
                        <path
                            d="m 22,117.69531 a 1,1 0 0 0 -1,1 V 129 a 1.0001,1.0001 0 0 0 1.447266,0.89453 L 28,127.11719 l 5.552734,2.77734 A 1.0001,1.0001 0 0 0 35,129 v -10.30469 a 1,1 0 0 0 -1,-1 1,1 0 0 0 -1,1 v 8.6875 l -4.552734,-2.27734 a 1.0001,1.0001 0 0 0 -0.894532,0 L 23,127.38281 v -8.6875 a 1,1 0 0 0 -1,-1 z"
                            id="path5345"
                            style={{
                                color: '#ffffff',
                                fill: '#ffffff',
                                fillRule: 'evenodd',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeMiterlimit: 4.1,
                            }}
                        ></path>
                        <path
                            d="m 28,102 c -5.510997,0 -10.000002,4.489 -10,10 -2e-6,5.511 4.489003,10 10,10 5.510997,0 10.000002,-4.489 10,-10 2e-6,-5.511 -4.489003,-10 -10,-10 z m 0,2 c 4.430118,0 8.000001,3.56988 8,8 10e-7,4.43012 -3.569882,8 -8,8 -4.430118,0 -8.000001,-3.56988 -8,-8 -1e-6,-4.43012 3.569882,-8 8,-8 z"
                            id="circle5330"
                            style={{
                                color: '#ffffff',
                                fill: '#ffffff',
                                fillRule: 'evenodd',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeMiterlimit: 4.1,
                            }}
                        ></path>
                        <path
                            d="m 20.423828,47.148437 a 1.2290729,1.2290729 0 0 0 -0.890625,0.105469 L 16,49.150391 12.466797,47.253906 a 1.2290729,1.2290729 0 0 0 -1.791016,1.300781 l 0.710938,3.947266 -2.8945315,2.773438 a 1.2290729,1.2290729 0 0 0 0.6835938,2.105468 l 3.9726567,0.542969 1.74414,3.611328 a 1.2290729,1.2290729 0 0 0 2.214844,0 l 1.74414,-3.611328 3.972657,-0.542969 a 1.2290729,1.2290729 0 0 0 0.683593,-2.105468 l -2.894531,-2.773438 0.710938,-3.947266 a 1.2290729,1.2290729 0 0 0 -0.900391,-1.40625 z m -6.876953,3.47461 1.871094,1.003906 a 1.2290729,1.2290729 0 0 0 1.164062,0 l 1.871094,-1.003906 -0.376953,2.091797 a 1.2290729,1.2290729 0 0 0 0.359375,1.105468 l 1.533203,1.470704 -2.103516,0.287109 a 1.2290729,1.2290729 0 0 0 -0.941406,0.681641 L 16,58.171875 15.076172,56.259766 a 1.2290729,1.2290729 0 0 0 -0.941406,-0.681641 l -2.103516,-0.287109 1.533203,-1.470704 a 1.2290729,1.2290729 0 0 0 0.359375,-1.105468 z"
                            id="path5332"
                            style={{
                                color: '#ffffff',
                                fill: '#ffffff',
                                fillRule: 'evenodd',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeMiterlimit: 4.1,
                            }}
                            transform="matrix(-0.8149634,0,0,-0.81244284,41.039413,156.41496)"
                        ></path>
                    </g>
                </g>
            </svg>
        </div>

        <div className={isShow ? 'playerRankBox' : 'playerRankBox hidden'}
            onMouseLeave={() => { setIsShow(false) }}>
            {isSearched
                ? <div className="d-flex flex-wrap justify-content-center gap-3">
                    {playerArr.map((player, index) => (
                        <GamePlayerNameCard
                            key={player.playername}
                            color={index % 7 % 2 == 0 ? colorType.orange : colorType.green}
                            text={<>{player.playername}<div>{player.playertotalscore}</div></>} />
                    ))}

                </div>
                : <GameLoading color='white' style={{ scale: '.3' }} />}
        </div>
    </React.Fragment>

}
