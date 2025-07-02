import { AddCircle, Delete, Edit } from "@mui/icons-material"
import { GCCalender, GCCalenderColor, GCCalenderDataType, GCCalenderEnums, GCCalenderInterFace, getCodeListTime } from "./Calender"
import { calendarDataType, calendarLabelType, DateTimeFormate, HandleEvent } from "./types"
import React, { useEffect, useRef, useState } from "react"
import { fakeCalendarData } from "./fakeData"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import BackIcon from "../../svg/img_back"
import { PageState, PopUpModel } from "../../components/popUpModel"
import { CalendarStorage, useIndexedDB } from "../../entity/useIndexedDB"
import { colorEnum } from "../../components/allEnum"
import { MySelector } from "../../components/Selector"
import TextInput from "../../components/textInput"

const calendarLabelKey = "calendarLabelSet"
export default function CalendarPage() {
    const navigate = useNavigate()
    const calenderRef = useRef<GCCalenderInterFace | null>(null)
    /** 使用 MUI 默認主題 */
    const theme = createTheme();
    const [pageState, setPageState] = useState<PageState>({
        isLoaded: false,
        modelOpen: false,
        modelInner: null,
    })
    const { setItem, getItem, getAllItem } = useIndexedDB()

    const [calendarLabel, setCalendarLabel] = useState<calendarLabelType[]>([])
    const [calendarData, setCalendarData] = useState<calendarDataType[]>([])

    async function init() {
        // 查詢行事曆標籤
        setCalendarLabel(() => {
            try {
                const data = JSON.parse(localStorage.getItem(calendarLabelKey) || "[]")
                if (Array.isArray(data) && data.every(item =>
                    item && typeof item === 'object' && 'id' in item && 'name' in item && 'color' in item
                )) {
                    return data
                }
                return []
            } catch (error) {
                console.error("error, calendar label JSON parse faild", error);
                return []
            }
        })

        try {
            // 查詢月曆行程
            await getAllItem(CalendarStorage).then(res => {
                try {
                    const data = JSON.parse(localStorage.getItem(calendarLabelKey) || "[]")
                    if (Array.isArray(data) && data.every(item =>
                        item && typeof item === 'object' && 'startTime' in item && 'endTime' in item && 'id' in item
                    )) {
                        setCalendarData(data)
                    }
                } catch (error) {
                    console.error("error, Calendar Data JSON parse faild", error);
                }
            })
        } catch (error) {
            console.error("error, get All Calendar Data faild", error);
        }
    }

    /** 新增 modal click */
    function addModalClick(selectDate: Date) {
        setPageState(prev => ({
            ...prev,
            modelOpen: true,
            modelInner: {
                title: "添加行事曆",
                modelInner: <ModalCalendarAddInner />,
                size: "large"
            }
        }))

    }

    useEffect(() => {
        init()
    }, [])

    return <React.Fragment>
        <ThemeProvider theme={theme}>
            <div className=" w-100 h100 p-5 bg_light">
                <GCCalender
                    ref={calenderRef}
                    timeStart={"0000"}
                    timeEnd={"2359"}
                    DatePickerButtonSet={{
                        display: true,
                        type: 'month'
                    }}
                    primaryTitle="動態月曆"
                    viewMode={[GCCalenderEnums.viewMode.MONTH, GCCalenderEnums.viewMode.DAY,]}
                    timeMode={GCCalenderEnums.timeMode.FULL}
                    usingMode={GCCalenderEnums.usingMode.EDITONLY}
                    dayCustomContextMenuEvent={[
                        {
                            content: () => '操作選單',
                            style: { fontWeight: '700', borderBottom: "1px solid #e0e0e0" },
                        },
                        {
                            icon: <AddCircle color="secondary" />,
                            content: (date: Date) => `添加行事曆 ${DateTimeFormate.dateToString({ date: date, mode: DateTimeFormate.DateMode.yyyyMMddhhmm })}`,
                            onClick: (date: Date) => { addModalClick(date) }
                        }
                    ]}
                    data={
                        [{
                            dataId: "001",
                            name: "測試資料",
                            collapse: true,
                            eventDataArr: fakeCalendarData.map((reservationItem, index) => {
                                return ({
                                    ...reservationItem,
                                    eventContent: reservationItem.title,
                                    eventType: GCCalenderEnums.eventType.CHIPCARD,
                                    contextMenuList: [
                                        {
                                            content: () => '操作選單',
                                            style: { fontWeight: '700', borderBottom: "1px solid #e0e0e0" },
                                        },
                                        {
                                            content: () => `行事曆主題: ${reservationItem.title}`
                                        },
                                    ],
                                })
                            })
                        },]}
                    invalidEvent={() => { }}
                />
            </div>
        </ThemeProvider>
        <div className="iconBtn position-absolute end-0 top-0" style={{ width: "45px" }} onClick={() => {
            navigate("/")
        }}>
            <BackIcon className=" w-100" />
        </div>
        <PopUpModel
            modelOpen={pageState.modelOpen}
            modelInner={pageState.modelInner}
            closeFnc={() => { setPageState(prev => ({ ...prev, modelOpen: false })) }}
        />
    </React.Fragment>
}

function ModalCalendarAddInner() {
    const codeListTime = getCodeListTime({
        timeStart: DateTimeFormate.dateFormate({
            dateStr: "202509090000",
            Mode: DateTimeFormate.DateMode.hhmm,
            joinTime: ''
        }),
        timeEnd: DateTimeFormate.dateFormate({
            dateStr: "202509092359",
            Mode: DateTimeFormate.DateMode.hhmm,
            joinTime: ''
        }),
        type: 'halfHour'
    })
    const [calendarLabel, setCalendarLabel] = useState<calendarLabelType[]>([])
    const [addData, setAddData] = useState<calendarDataType>({
        id: "",
        labelID: "",
        title: "",
        startTime: "",
        endTime: "",
    })
    async function init() {
        // 查詢行事曆標籤
        setCalendarLabel(() => {
            try {
                const data = JSON.parse(localStorage.getItem(calendarLabelKey) || "[]")
                if (Array.isArray(data) && data.every(item =>
                    item && typeof item === 'object' && 'id' in item && 'name' in item && 'color' in item
                )) {
                    return data
                }
                return []
            } catch (error) {
                console.error("error, calendar label JSON parse faild", error);
                return []
            }
        })
    }

    /** 輸入暫存名稱 */
    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name,
            value = e.target.value,
            type = e.target.type

        setAddData(prev => ({
            ...prev,
            [name]: type === "time" ? DateTimeFormate.dateRegex(value) : value
        }))
    }

    useEffect(() => { init() }, [])

    return <React.Fragment>
        <div className="w-100 d-flex flex-row gap-2">
            <TextInput
                label="請輸入行程主題"
                value={addData.title}
                name="title"
                onChange={(e) => {
                    handleInput(e)
                }}
            />
            <TextInput
                label="請輸入行程備註"
                value={addData.note ?? ""}
                name="title"
                onChange={(e) => {
                    handleInput(e)
                }}
            />
            <MySelector
                label="請選擇時間起"
                type="time"
                value={addData.startTime}
                name="startTime"
                onChange={(e) => {
                }}
                optionKey={"name"}
                codeList={codeListTime}
            />
            <MySelector
                label="請選擇時間迄"
                type="time"
                value={addData.endTime}
                name="endTime"
                onChange={(e) => {
                }}
                optionKey={"name"}
                codeList={codeListTime}
            />
        </div>
    </React.Fragment>
}