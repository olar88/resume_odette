import React from "react";

export default function TextInput(props: {
    style?: React.CSSProperties,
    errorMessage?: string,
    label?: string,
    value: string,
    name: string,
    placeholder?: string,
    type?: React.HTMLInputTypeAttribute,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}) {


    return <React.Fragment>
        <div className="form_box">
            <label className="label">{props.label}</label>
            <input
                style={props.style}
                type={props.type ?? "text"}
                placeholder={props.placeholder}
                name={props.name}
                className="textInput"
                value={props.value}
                onChange={props.onChange}
            />
            <div className="login_input_alert_info input_alert_true">
                {props.errorMessage}
            </div>
        </div>
    </React.Fragment>
}