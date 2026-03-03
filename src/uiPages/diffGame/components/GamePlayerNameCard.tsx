import React, { useState, } from "react";
import { colorType } from "../allType"

/**@description 遊戲 玩家 姓名卡片 */
export default function GamePlayerNameCard(props: {
    color: colorType,
    text: string | React.ReactNode,
    className?: string,
    id?: string,
    style?: React.CSSProperties


}) {

    if (props.color === colorType.orange) {
        return <React.Fragment>
            <div
                id={props.id}
                className={(props.className ? props.className : '') + " name_card org"}
                style={props.style}>
                <svg className="birdORG" width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4051 11.9935C11.9312 10.6851 13.1998 9.82788 14.61 9.82788V9.82788C15.9858 9.82788 17.2304 10.6443 17.7784 11.9062L23.3935 24.8362C24.8274 28.1382 22.4071 31.8279 18.8072 31.8279H10.8292C7.28806 31.8279 4.86912 28.2481 6.19023 24.9625L11.4051 11.9935Z" fill="white" />
                    <path className="mouth" d="M1.99143 4.27235L9.1908 3.12431L5.74155 10.5242L1.99143 4.27235Z" fill="#FFB401" />
                    <ellipse cx="14.9297" cy="9.82788" rx="9.5" ry="9" fill="white" />
                    <path d="M15.5797 5.83512C15.2253 7.29814 14.0716 8.27429 13.0029 8.01541C11.9342 7.75653 11.3551 6.36066 11.7095 4.89764C12.5964 5.11247 12.5758 5.10752 13.6446 5.3664C14.7133 5.62527 14.7734 5.63981 15.5797 5.83512Z" fill="#FB571F" />
                    <path className="wing" d="M25.3919 16.3745C27.0697 19.596 26.0261 23.4595 23.061 25.0037C20.0959 26.5479 16.3321 25.1881 14.6543 21.9666C17.121 20.6819 17.058 20.7147 20.0231 19.1705C22.9882 17.6263 23.2154 17.508 25.3919 16.3745Z" fill="#FB571F" />
                </svg>

                {props.text}
            </div>

        </React.Fragment>
    }

    else if (props.color === colorType.green) {
        return <React.Fragment>
            <div
                id={props.id}
                className={(props.className ? props.className : '') + " name_card gr"}
                style={props.style}>
                <svg className="birdGR" width="26" height="33" viewBox="0 0 26 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00074 4.29234L9.2338 3.13893L5.76841 10.5734L2.00074 4.29234Z" fill="#FFB401" />
                    <path d="M10.9754 12.1656C11.5015 10.8572 12.7701 10 14.1803 10V10C15.5561 10 16.8007 10.8164 17.3487 12.0784L22.9638 25.0084C24.3977 28.3104 21.9775 32 18.3776 32H10.3996C6.85838 32 4.43944 28.4202 5.76054 25.1347L10.9754 12.1656Z" fill="white" />
                    <ellipse cx="14.5" cy="10" rx="9.5" ry="9" fill="white" />
                    <circle className='eyes' cx="13" cy="7" r="2" fill="#1F4B52" />
                    <path className="wing" d="M25.9436 28.9634C23.0545 31.1927 19.0489 30.8443 16.9971 28.1851C14.9452 25.526 15.624 21.563 18.5132 19.3337C20.2202 21.5459 20.1765 21.4894 22.2284 24.1485C24.2803 26.8077 24.4375 27.0114 25.9436 28.9634Z" fill="#1F4B52" />
                </svg>

                {props.text}
            </div>
        </React.Fragment>
    }

    else {
        console.log('color tpye error! type:', props.color);
        return <button className="bg-danger">ERROR</button>
    }
}