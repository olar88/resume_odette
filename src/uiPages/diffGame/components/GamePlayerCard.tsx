import React, { useState, } from "react";
import { colorType } from "../allType";
import { Edit } from '@mui/icons-material'

/**
 * @description player card props
 * @param {boolean} isOpened 是否已公布答案 
 * @param {boolean} selected 是否被選擇 
 * @param {boolean} isDone 是否已交卷
 * @param {Event}  changeEvent 點擊事件
 * @param {string} playerName 玩家名稱
 * @param {string} playerItem 玩家資料陣列
 * @param {string} ansewerUrl 答案base64
 * @param {string} className className
 * @param {string} id id
 * @param {string} style 自訂樣式
 */
type GamePlayerCardProps<T> = {
    isOpened: boolean,
    selected: boolean,
    isDone: boolean,
    changeEvent: (item: T) => void,
    playerName: string,
    playerItem: T,
    ansewerUrl: string,
    className?: string,
    id?: string,
    style?: React.CSSProperties

}

/**@description 遊戲樣式 player card */
export default function GamePlayerCard<T>(props: GamePlayerCardProps<T>) {

    const inputChange = (event: React.MouseEvent<HTMLDivElement>, item: T) => {
        event.stopPropagation()
        props.changeEvent(item)
    }


    // 已公布答案
    if (props.isOpened) {
        // 被選擇
        if (props.selected) {
            return <React.Fragment>
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    inputChange(event, props.playerItem)
                }} className={(props.className ? props.className : '') + " answerCard"}>

                    <img id={props.id} src={props.ansewerUrl} className="answrePic" />
                    <svg className="selecterCircle selected" xmlns="http://www.w3.org/2000/svg" width="232" height="141"
                        viewBox="0 0 232 141" fill="none">
                        <path
                            d="M215.227 123.055C211.137 128.139 199.072 131.748 191.695 133.468C164.455 139.818 133.452 138.486 105.416 139.917C73.5387 138.248 30.0186 134.074 11.0841 112.393C-17.9706 79.1232 28.6744 34.4075 66.5683 17.752C106.766 0.0838019 165.005 -5.28823 205.38 15.111C226.844 25.9554 232.955 47.1945 228.758 65.225C222.795 90.8418 204.807 109.617 173.955 123.055C160.679 128.837 149.846 132.388 135.107 135.786C118.267 139.667 103.034 139.491 85.8477 141"
                            stroke="#FB571F" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="playerName">
                        {props.playerName}
                    </div>
                </div>
            </React.Fragment>
        } else {
            // 不被選擇
            return <React.Fragment>
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    inputChange(event, props.playerItem)
                }} className={(props.className ? props.className : '') + " answerCard"}>

                    <img id={props.id} src={props.ansewerUrl} className="answrePic" />
                    <svg className="selecterCircle " xmlns="http://www.w3.org/2000/svg" width="232" height="141"
                        viewBox="0 0 232 141" fill="none">
                        <path
                            d="M215.227 123.055C211.137 128.139 199.072 131.748 191.695 133.468C164.455 139.818 133.452 138.486 105.416 139.917C73.5387 138.248 30.0186 134.074 11.0841 112.393C-17.9706 79.1232 28.6744 34.4075 66.5683 17.752C106.766 0.0838019 165.005 -5.28823 205.38 15.111C226.844 25.9554 232.955 47.1945 228.758 65.225C222.795 90.8418 204.807 109.617 173.955 123.055C160.679 128.837 149.846 132.388 135.107 135.786C118.267 139.667 103.034 139.491 85.8477 141"
                            stroke="#FB571F" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="playerName">
                        {props.playerName}
                    </div>
                </div>
            </React.Fragment>
        }

    } else {
        if (props.isDone) {
            return <React.Fragment>
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    inputChange(event, props.playerItem)
                }} className={(props.className ? props.className : '') + " answerCard"}>

                    <div id={props.id} className="answrePic" ></div>
                    <div className="card-Editing done">
                        <svg width="60" height="60" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className='check_circle' cx="21" cy="21" r="18" stroke="#F5C646" strokeWidth={'3px'} />
                            <path className='check' d="M31 15C27.8333 18.5 20.5 27 20.5 27C20.5 27 16.1667 23.1667 14 20.5" stroke="#F5C646" strokeWidth='2px' strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="playerName">
                        {props.playerName}
                    </div>
                </div>
            </React.Fragment>
        } else {
            return <React.Fragment>
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    inputChange(event, props.playerItem)
                }} className={(props.className ? props.className : '') + "answerCard"}>

                    <div id={props.id} className="answrePic" ></div>
                    <Edit fontSize="large" className='card-Editing animate__animated animate__slow animate__swing animate__animated animate__infinite' style={{ fill: '#fff' }} />

                    <div className="playerName">
                        {props.playerName}
                    </div>
                </div>
            </React.Fragment >
        }
    }
}