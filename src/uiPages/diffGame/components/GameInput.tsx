import React, { useState, } from "react";
import { colorType } from "../allType";

type GameInputProps<T> = {
    color: colorType,
    changeEvent: (event: T) => void,
    value: string,
    placeholder?: string,
    disabled?: boolean,
    className?: string,
    id?: string,
    style?: React.CSSProperties

}

/**@description 遊戲樣式 input */
export default function GameInput<T extends React.ChangeEvent<HTMLInputElement>>(props: GameInputProps<T>) {

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.changeEvent(event as T)
    }


    if (props.color === colorType.yellow) {
        return <React.Fragment>
            <input
                value={props.value}
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + " game_input input_YL"}
                disabled={props.disabled ? props.disabled : false}
                onChange={(e) => inputChange(e)}
                placeholder={props.placeholder}
                style={props.style}
            />
        </React.Fragment>
    }

    else if (props.color === colorType.orange) {
        return <React.Fragment>
            <input
                value={props.value}
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + " game_input input_OG"}
                disabled={props.disabled ? props.disabled : false}
                onChange={(e) => inputChange(e)}
                placeholder={props.placeholder}
                style={props.style}

            />

        </React.Fragment>
    }

    else if (props.color === colorType.green) {
        return <React.Fragment>
            <input
                value={props.value}
                id={props.id ? props.id : ''}
                className={(props.className ? props.className : '') + " game_input input_GR"}
                disabled={props.disabled ? props.disabled : false}
                onChange={(e) => inputChange(e)}
                placeholder={props.placeholder}
                style={props.style}

            />

        </React.Fragment>
    }

    else {
        console.log('color tpye error! type:', props.color);
        return <button className="bg-danger">ERROR</button>
    }
}