import React, { useState, useEffect } from 'react'
import DeleteIcon from '../svg/img_delete'

export type PageState = {
    isLoaded: boolean,
    isSend?: boolean,
    modalOpen: boolean,
    modalInner: ModalInnerType | null
}

export type ModalInnerType = {
    id?: string,
    title: string,
    modalInner: React.ReactNode,
    size: 'large' | 'medium',
    modalBtnGorup?: React.ReactNode,
    modalAction?: Function
}

export function PopUpModal(props: {
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
                            <div className="hover-point" style={{ width: "25px" }}>
                                <DeleteIcon
                                    className=''
                                    onClick={() => { props.closeFnc() }} /></div>
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
                                        <button onClick={() => { props.closeFnc() }} className="my-btn sm-btn btn-alert m-2">取消</button>
                                        <button onClick={() => { if (props.modalInner && props.modalInner.modalAction) props.modalInner.modalAction() }} className="my-btn sm-btn btn-alert m-2">確認</button>

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