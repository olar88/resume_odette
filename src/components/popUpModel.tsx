import React, { useState, useEffect } from 'react'
import CloseIcon from '../svg/img_close'

export type PageState = {
    isLoaded: boolean,
    isSend?: boolean,
    modelOpen: boolean,
    modelInner: ModelInnerType | null
}

export type ModelInnerType = {
    id?: string,
    title: string,
    modelInner: React.ReactNode,
    size: 'large' | 'medium',
    modelBtnGorup?: React.ReactNode,
    modelAction?: Function
}

export function PopUpModel(props: {
    modelOpen: boolean,
    modelInner: PageState['modelInner'],
    closeFnc: Function,
}) {
    const [open, setOpen] = useState<boolean>(props.modelOpen)

    useEffect(() => {
        setOpen(props.modelOpen)
    }, [props])

    return <React.Fragment>

        {open
            && props.modelInner !== null
            ? <React.Fragment>
                <div className="GameModel">
                    <div className="modelInnerSpace" style={{ width: props.modelInner?.size === 'large' ? "800px" : "400px" }}>
                        <div className="GameModelTop">
                            <div className='title-L ' style={{ fontSize: '1.1rem' }}>{props.modelInner.title}</div>
                            <div className="hover-point" style={{ width: "25px" }}>
                                <CloseIcon
                                    className=''
                                    onClick={() => { props.closeFnc() }} /></div>
                        </div>

                        <div className="GameModelInnerNode">
                            {props.modelInner
                                ? props.modelInner.modelInner
                                : null}
                        </div>

                        <div className="GameModelBottom">
                            {props.modelInner?.modelBtnGorup
                                ? props.modelInner?.modelBtnGorup
                                : !!props.modelInner?.modelAction
                                    ? <div className='d-flex justify-content-end gap-2'>
                                        <button onClick={() => { props.closeFnc() }} className="my-btn sm-btn btn-dark m-2">取消</button>
                                        <button onClick={() => { if (props.modelInner && props.modelInner.modelAction) props.modelInner.modelAction() }} className="my-btn sm-btn btn-alert m-2">確認</button>

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