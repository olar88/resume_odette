import React, { useState, } from "react";
import { colorType } from "../allType";

/**@description 遊戲樣式 Title Box */
export default function GameTitleBox(props: {
    color: colorType,
    text: string | React.ReactNode,
    className?: string,
    id?: string,
    style?: React.CSSProperties

}) {

    if (props.color === colorType.yellow) {
        return <React.Fragment>
            <div id={props.id} className={(props.className ? props.className : '') + " titleBar title_YL"} style={props.style}>
                <div className="titleInner ">
                    {props.text}
                </div>
            </div>

        </React.Fragment>
    }

    else if (props.color === colorType.orange) {
        return <React.Fragment>
            <div id={props.id} className={(props.className ? props.className : '') + " titleBar title_YL"} style={props.style}>
                <div className="titleInner ">
                    {props.text}
                </div>
            </div>
        </React.Fragment>
    }

    else if (props.color === colorType.green) {
        return <React.Fragment>
            <div id={props.id} className={(props.className ? props.className : '') + " titleBar title_GR"} style={props.style}>
                <div className="titleInner ">
                    {props.text}
                </div>
            </div>
        </React.Fragment>
    }

    else {
        console.log('color tpye error! type:', props.color);
        return <button className="bg-danger">ERROR</button>
    }
}