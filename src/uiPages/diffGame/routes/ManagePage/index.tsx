import React, { useEffect, useState } from "react";
import { Question } from "../../api/api";
import GameTextButton from "../../components/GameTextButton";
import { AddCircleOutline, Search, } from "@mui/icons-material";
import { PageState, colorType } from "../../allType";
import GameInput from "../../components/GameInput";
import { GameModal } from "../../components/GameModal";
import GameLoading from "../../components/GameLoading";
import GameErrorPage from "../../components/GameErrorPage";
import { GameAlertResult } from "../../components/GameAlertResult";
import { fakeQuestionData } from "../../fakeData";

export function ManagePage() {
    //#region states
    const [state, setState] = useState<PageState>({
        isLoaded: true,
        modalOpen: false,
        modalInner: null,
    })

    /** 搜尋 題目 參數 */
    const [pageSearch, setPageSearch] = useState<Question.QuestionSearchParams>({ question: '' })
    /** 搜尋 題目 結果 */
    const [resDArr, setResDArr] = useState<Question.QuestionSearchResItem[]>([])

    //#endregion 

    //#region API Fnc
    /** 查找題目 */
    const search = async function () {
        setResDArr(fakeQuestionData)
    }

    //#endregion 

    //#region Click Fnc
    /** 新增題目 Modal Click */
    const addModalClick = () => {
        let newQ = ''
        const setNewQ = (str: string) => { newQ = str }
        setState(prev => ({
            ...prev,
            modalOpen: true,
            modalInner: {
                id: "addGameQuestion",
                title: "新增題目",
                modalInner: <ModalAddInner
                    setNewQ={setNewQ}
                />,
                modalAction: () => {
                    if (newQ.length > 0) {
                        setState(prev => ({ ...prev, isLoaded: false }))
                        addModalConfirm(newQ)
                    } else {
                        window.alert('尚未輸入題目')
                        console.log('無輸入題目');
                    }
                },
                size: 'medium'
            }
        }))
    }

    /** 新增題目 確認 */
    const addModalConfirm = async (newQ: string) => {
        setResDArr(prev => [
            ...prev,
            {
                question_id: new Date().getTime().toString(),
                question: newQ
            }
        ])
    }

    /** 編輯題目 Modal Click */
    const editModalClick = (item: Question.QuestionSearchResItem) => {
        let newQ = item.question
        const setNewQ = (str: string) => { newQ = str }
        setState(prev => ({
            ...prev,
            modalOpen: true,
            modalInner: {
                id: "addGameQuestion",
                title: "編輯題目",
                modalInner: <ModalAddInner
                    setNewQ={setNewQ}
                    originQ={newQ}
                />,
                modalAction: () => {
                    if (newQ.length > 0) {
                        setState(prev => ({ ...prev, isLoaded: false }))
                        editModalConfirm({ question: newQ, question_id: item.question_id })
                    } else {
                        window.alert('題目不得為空')
                        console.log('無輸入題目');
                    }
                },
                size: 'medium'
            }
        }))
    }

    /** 新增題目 確認 */
    const editModalConfirm = async (item: Question.QuestionSearchResItem) => {
        setState(prev => ({
            ...prev,
            isLoaded: true,
            modalOpen: false,
            modalInner: null
        }))
        setResDArr(prev => {
            let newArr = [...prev],
                indx = prev.findIndex(ele => ele.question_id === item.question_id)
            newArr[indx].question = item.question
            return newArr
        })
    }

    /** 刪除題目 Modal Click */
    const deleteModalClick = (item: Question.QuestionSearchResItem) => {
        setState(prev => ({
            ...prev,
            modalOpen: true,
            modalInner: {
                id: "deleteGameQuestion",
                title: "刪除題目",
                modalInner: <ModalDeleteInner
                    question={item.question}
                />,
                modalAction: () => { setState(prev => ({ ...prev, isLoaded: false })); deleteModalConfirm(item) },
                size: 'medium'
            }
        }))
    }

    /** 刪除題目 確認 */
    const deleteModalConfirm = async (item: Question.QuestionSearchResItem) => {
        setState(prev => ({
            ...prev,
            isLoaded: true,
            modalOpen: false,
            modalInner: null
        }))
        setResDArr(prev => {
            let newArr = prev.filter(ele => ele.question_id === item.question_id)
            return newArr
        })
    }
    //#endregion 

    useEffect(() => { search() }, [])

    if (localStorage.getItem('user_id') && sessionStorage.getItem('company_code') === 'ERP') {
        return <React.Fragment>
            <div className="myContainer">
                <div className="background d-flex flex-column justify-content-start gap-3">
                    <div className='title-Max ' style={{ fontSize: '.85rem' }}>The management page of</div>
                    <div className='title-Max  animate__animated animate__flipInX'><span style={{ color: 'var(--dark_Or)' }}>D</span>iff <span style={{ color: 'var(--dark_Gr)' }}>G</span>ame</div>


                    <div className="text-center d-flex justify-content-center gap-5 position-relative">
                        <GameInput
                            color={colorType.yellow}
                            changeEvent={(e) => { setPageSearch({ question: e.target.value }) }}
                            value={pageSearch.question}
                        />
                        <Search style={{ position: 'absolute', top: '50%', right: "50%", transform: 'translate(130px,-50%)', cursor: 'pointer' }}
                            fontSize='small'
                            onClick={() => {
                                search()
                            }}
                        />
                    </div>

                    <div className="d-flex justify-content-end pe-2">
                        <GameTextButton
                            style={{ fontSize: '.9rem', padding: '5px 8px' }}
                            text={<><AddCircleOutline />新建題目</>}
                            color={colorType.orange}
                            clickEvent={() => { addModalClick() }}
                        />
                    </div>

                    <div className="d-flex flex-wrap gap-3 p-2 overflow-y-scroll" style={{ maxHeight: '50%' }}>
                        {state.isLoaded
                            ? resDArr.length > 0
                                ? resDArr.map((item, index) => (
                                    <QuestionBox
                                        key={item.question_id}
                                        id={item.question_id}
                                        text={item.question}
                                        deleteEvent={() => { deleteModalClick(item) }}
                                        editEvent={() => { editModalClick(item) }}
                                    />
                                ))
                                : <GameAlertResult mainText="Opps !" minorText="查無題目，請更換搜尋條件" />
                            : <GameLoading />}
                    </div>

                </div>
            </div>


            <GameModal
                modalOpen={state.modalOpen}
                modalInner={state.modalInner}
                closeFnc={() => { setState(prev => ({ ...prev, modalOpen: false })) }}
            />

        </React.Fragment>
    } else {
        return <GameErrorPage state='403' />
    }

}

/**@description 新建/編輯 題目 modal */
function ModalAddInner(props: {
    setNewQ: (str: string) => void,
    originQ?: string,
}) {

    const [pageAdd, setPageAdd] = useState<Question.QuestionCreateParams>({
        question: props.originQ ? props.originQ : ''
    })

    useEffect(() => {
        props.setNewQ(pageAdd.question)
    }, [pageAdd.question])


    return <React.Fragment>
        <div className="d-flex justify-content-center align-items-center flex-column">
            <div className='title-Max mb-3' style={{ fontSize: '.85rem' }}>請輸入題目</div>
            <GameInput
                color={colorType.orange}
                changeEvent={(e) => {
                    ; setPageAdd({ question: e.target.value })
                }}
                value={pageAdd.question}
            />
            <div className='title-M mt-3' style={{ fontSize: '.75rem', textAlign: 'end' }}>若重複或空白將無法成功{props.originQ ? '編輯' : "新增"}</div>
        </div>
    </React.Fragment>
}

/**@description 刪除 題目 modal */
function ModalDeleteInner(props: {
    question: string
}) {
    return <React.Fragment>
        <div className="d-flex justify-content-center align-items-center flex-column">
            <div className='title-Max mb-3' style={{ fontSize: '.85rem', color: 'var(--dark_Or)' }}>確定要刪除題目?</div>
            <GameTextButton
                text={props.question}
                border={true}
                color={colorType.green}
                disabled={true}
                style={{
                    fontSize: '.95rem',
                }}
                clickEvent={() => { }}
            />
            <div className='title-M mt-3' style={{ fontSize: '.75rem', textAlign: 'end' }}>請再次確認刪除題目內容</div>
        </div>
    </React.Fragment>
}

/**@description 題目box */
function QuestionBox(props: {
    id?: string,
    className?: string,
    style?: React.CSSProperties,
    deleteEvent: Function,
    editEvent: Function,
    text: string,
}) {
    return <React.Fragment>
        <div
            id={props.id}
            className={(props.className ? props.className : '') + " questionBox"}

            style={props.style}>
            <div className="qustionBox_trashCan"
                onClick={() => { props.deleteEvent() }}
            >
                <svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_iconCarrier">
                        <path className="qustionBox_trashCanTop" d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z" fill="#1F4B52" />

                        <path opacity="0.5" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" fill="#1F4B52" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z" fill="#1F4B52" /> <path fillRule="evenodd" clipRule="evenodd" d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z" fill="#1F4B52" />
                    </g>

                </svg>
            </div>
            {props.text}
            <div className="qustionBox_edit"
                onClick={() => { props.editEvent() }}
            >
                <svg className="qustionBox_editPen" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_iconCarrier"  >
                        <path d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z" stroke="#FB571F" stroke-width="1.5" />
                        <path opacity="0.5" d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015" stroke="#FB571F" stroke-width="1.5" />
                    </g>

                </svg>
            </div>
        </div>
    </React.Fragment>
}
