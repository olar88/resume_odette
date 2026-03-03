import React, { useState, } from "react";
import { colorType } from "../allType";

/**@description 遊戲樣式 Text Button */
export default function GameTextButton(props: {
    color: colorType,
    text: string | React.ReactNode,
    clickEvent: () => void,
    className?: string,
    id?: string,
    style?: React.CSSProperties
    disabled?: boolean
    border?: boolean,
}) {

    if (props.color === colorType.yellow) {
        if (!!props.border) {
            return <button
                id={props.id}
                className={(props.className ? props.className : '') + " room_card yl"}
                style={props.style}
                onClick={props.clickEvent}
                disabled={!!props.disabled}
            >
                {props.text}
            </button>
        } else {
            return <React.Fragment>
                <button
                    id={props.id}
                    className={(props.className ? props.className : '') + " text_btn yl" + (props.disabled ? ' noHover' : '')}
                    onClick={props.clickEvent}
                    style={props.style}
                    disabled={!!props.disabled}
                >
                    {props.text}
                </button>

            </React.Fragment>
        }
    }

    else if (props.color === colorType.orange) {
        if (!!props.border) {
            return <button
                id={props.id}
                className={(props.className ? props.className : '') + " room_card org" + (props.disabled ? ' noHover' : '')}
                style={props.style}
                onClick={props.clickEvent}
                disabled={!!props.disabled}
            >
                {props.text}
            </button>
        }
        else {
            return <React.Fragment>
                <button
                    id={props.id}
                    className={(props.className ? props.className : '') + " text_btn org"}
                    onClick={props.clickEvent}
                    style={props.style}
                    disabled={!!props.disabled}
                >
                    {props.text}
                </button>
            </React.Fragment>
        }
    }

    else if (props.color === colorType.green) {
        if (!!props.border) {
            return <button
                id={props.id}
                className={(props.className ? props.className : '') + " room_card gr" + (props.disabled ? ' noHover' : '')}
                style={props.style}
                onClick={props.clickEvent}
                disabled={!!props.disabled}
            >
                {props.text}
            </button>
        }
        else {
            return <React.Fragment>
                <button
                    id={props.id}
                    className={(props.className ? props.className : '') + " text_btn gr"}
                    onClick={props.clickEvent}
                    style={props.style}
                    disabled={!!props.disabled}
                >
                    {props.text}
                </button>
            </React.Fragment>
        }
    }

    else {
        console.log('color tpye error! type:', props.color);
        return <button className="bg-danger">ERROR</button>
    }
}