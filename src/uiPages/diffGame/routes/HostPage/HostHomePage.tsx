import React, { useEffect, useState, } from 'react'
import GameIconButton from '../../components/GameIconButton'
import { PageState, colorType } from '../../allType'
import GameInput from '../../components/GameInput'
import GameTextButton from '../../components/GameTextButton'
import { MeetingRoom, SportsEsports } from '@mui/icons-material'

export default function HostHomePage(props: {
    nowStep: 'home' | 'new'
}) {

    const [gameName, setGameName] = useState<string>('')
    const [state, setState] = useState<PageState & { startNewGamePermission: boolean }>({
        isLoaded: true,
        modalOpen: false,
        modalInner: null,
        startNewGamePermission: false
    })

    // TODO 是否要判別 為公司內部成員才可開啟新局
    // useEffect(() => {
    //     setState(prev => ({
    //         ...prev,
    //         startNewGamePermission: !!localStorage.getItem('user_id') && sessionStorage.getItem('company_code') === 'ERP'
    //     }))
    // }, [])

    //if (state.isLoaded) {
    return <React.Fragment>
        <div className="background d-flex flex-column justify-content-center gap-5">
            {props.nowStep === 'home'
                ? <React.Fragment>
                    <div className='title-Max  animate__animated animate__flipInX'><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                    <div className="text-center d-flex justify-content-center gap-5">
                        <GameTextButton
                            id='start_new_game_btn'
                            text={<><SportsEsports fontSize='large' /> 開啟新遊戲間</>}
                            color={colorType.yellow}
                            clickEvent={() => { }} />

                        <GameTextButton
                            id='join_a_game_btn'
                            text={<><MeetingRoom fontSize='large' /> 加入遊戲間</>}
                            color={colorType.orange}
                            clickEvent={() => { }} />
                    </div>
                </React.Fragment>
                : props.nowStep === 'new'
                    ? <React.Fragment>
                        <div className='title-Max ' style={{ fontSize: '.95rem' }}>Start a </div>
                        <div className='title-Max '>New <span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>
                        <div className="text-center">
                            <GameInput
                                id={'new_game_name'}
                                color={colorType.yellow}
                                changeEvent={(e) => { setGameName(e.target.value) }}
                                value={gameName}
                                placeholder={'新遊戲名稱'}
                            />
                        </div>
                        <div className="text-center">
                            <GameIconButton
                                id={'new_game_start'}
                                color={colorType.yellow} clickEvent={() => { }} />
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className='startTitle text-danger'>404 PAGE ERROR !</div>
                    </React.Fragment>

            }
        </div>
    </React.Fragment>
    // } else {
    //     return <div className="background d-flex flex-column justify-content-center gap-5">
    //         <GameLoading />
    //     </div>
    // }
}