import { Route, Routes, useNavigate } from 'react-router-dom';
import PlayerHomePage from './PlayerHomePage';
import PlayerPlayingPage from './PlayerPlayingPage';
import GameIconButton from '../../components/GameIconButton';
import { colorType } from '../../allType';
import { useEffect, useState } from 'react';


function PlayerPage(props: { Mobiledevice?: boolean }) {
    const nevigate = useNavigate()
    const [backBtn, setBackBtn] = useState<{ event: Function, show: boolean }>({
        event: () => { nevigate('/') },
        show: true
    })

    return (
        <div className="PlayerPage">
            <div className="myContainer">
                <div className="mobileBackground">

                    {/* 返回鍵 */}
                    <div className={backBtn.show ? 'backBtn' : 'd-none'}>
                        <GameIconButton color={colorType.greenBack} clickEvent={() => backBtn.event()}
                        />
                    </div>

                    <Routes>
                        <Route index element={<PlayerHomePage setBackBtn={setBackBtn} Mobiledevice={!!props.Mobiledevice} />} />
                        <Route path="Playing" element={<PlayerPlayingPage setBackBtn={setBackBtn} Mobiledevice={!!props.Mobiledevice} />} />
                    </Routes>
                </div>
            </div>
        </div>

    );
}

export default PlayerPage;