import React, { useState, useEffect } from 'react'
import { PageState } from "../allType"
import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'

export function GameModal(props: {
    modalOpen: boolean,
    modalInner: PageState['modalInner'],
    closeFnc: Function,
}) {
    const [open, setOpen] = useState<boolean>(props.modalOpen)

    useEffect(() => {
        setOpen(props.modalOpen)
    }, [props])

    return <React.Fragment>

        {open
            && props.modalInner !== null
            ? <React.Fragment>
                <div className="GameModal">
                    <div className="modalInnerSpace" style={{ width: props.modalInner?.size === 'large' ? "800px" : "400px" }}>
                        <div className="GameModalTop">
                            <div className='title-L ' style={{ fontSize: '1.1rem' }}>{props.modalInner.title}</div>
                            <Close
                                onClick={() => { props.closeFnc() }}
                                style={{ fill: "var(--dark_Gr)", cursor: "pointer" }} />
                        </div>

                        <div className="GameModalInnerNode">
                            {props.modalInner
                                ? props.modalInner.modalInner
                                : null}
                        </div>

                        <div className="GameModalBottom">
                            {props.modalInner?.modalBtnGorup
                                ? props.modalInner?.modalBtnGorup
                                : !!props.modalInner?.modalAction
                                    ? <div className='d-flex justify-content-end gap-2'>
                                        <Button className='GameModalBtn_cancle' onClick={() => { props.closeFnc() }}>取消</Button>
                                        <Button onClick={() => { if (props.modalInner && props.modalInner.modalAction) props.modalInner.modalAction() }} className='GameModalBtn_confirm'>確認</Button>

                                    </div>
                                    : null}


                        </div>


                    </div>
                </div>
            </React.Fragment>
            : null
        }

    </React.Fragment>







}