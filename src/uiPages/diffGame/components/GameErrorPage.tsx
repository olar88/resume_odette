import React from 'react'
import { useNavigate } from 'react-router-dom'

/**@description 錯誤頁面 */
export default function GameErrorPage(props: {
    state: '403' | '404'
}) {
    const nevigate = useNavigate()

    return <React.Fragment>
        <div className="myContainer">
            <div className="background d-flex flex-column gap-4 justify-content-center">
                <div className='title-S' style={{ color: 'black', fontSize: '1rem' }} ><span style={{ color: 'var(--dark_Or)' }}>Opps !</span></div>
                <div className='title-Max' style={{ color: 'black' }}>
                    <span style={{ color: 'var(--dark_Or)' }}>{props.state}</span>&nbsp;
                    <span style={{ color: 'var(--dark_Gr)' }}>{props.state == '403' ? "Forbidden" : "Error"} </span>
                </div>
                {props.state == '403' ? <>
                    <div className='title-S' style={{ color: '#818181', fontSize: '.8rem' }}>
                        You do not have permission to access, please return to the DiffGame homepage. Thank you.
                    </div>
                    <div className='title-S' style={{ color: '#818181', fontSize: '.8rem' }}>
                        您無權限拜訪，請回遊戲首頁謝謝
                    </div>

                </>
                    : <>
                        <div className='title-S' style={{ color: '#818181', fontSize: '.8rem' }}>
                            This webpage is not available, please return to the DiffGame homepage. Thank you.
                        </div>
                        <div className='title-S' style={{ color: '#818181', fontSize: '.8rem' }}>
                            顯示這個網頁發生錯誤。
                        </div>
                    </>}
                <div className='title-S' style={{ color: 'black', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => { nevigate('/') }}><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>

            </div>
        </div>
    </React.Fragment>
}