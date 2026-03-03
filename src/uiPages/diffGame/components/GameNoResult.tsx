import React from 'react'
import { ErrorOutline } from "@mui/icons-material"

export function GameNoResult(props: {
    text?: string
}) {
    return <React.Fragment><div className="text-center d-flex justify-content-center gap-2 position-relative flex-column w-100 align-items-center">
        <ErrorOutline style={{ width: '100px', height: '100px', fill: '#637e83' }} />
        <div style={{ color: '#637e83' }}>
            {props.text
                ? props.text
                : '查無結果'}</div>
    </div>
    </React.Fragment>

}