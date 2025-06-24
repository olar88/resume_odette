import React from "react";


export default function GameLoading(props: {
    color?: "white",
    style?: React.CSSProperties
}) {

    return <React.Fragment>
        <div className="loading_Background">
            <div className="dotGroup" style={props.style ? props.style : undefined}>
                <div className={"circle" + (props.color === 'white' ? " white" : '')}></div>
                <div className={"circle" + (props.color === 'white' ? " white" : '')}></div>
                <div className={"circle" + (props.color === 'white' ? " white" : '')}></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>

            </div>
        </div>
    </React.Fragment>


}