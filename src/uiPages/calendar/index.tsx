import { AddCircle, Delete, Edit } from "@mui/icons-material"
import { GCCalender, GCCalenderColor, GCCalenderDataType, GCCalenderEnums, GCCalenderInterFace } from "./Calender"
import { DateTimeFormate } from "./types"
import React, { useRef, useState } from "react"
import { fakeCalendarData } from "./fakeData"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import BackIcon from "../../svg/img_back"
import { PageState, PopUpModel } from "../../components/popUpModel"

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

    /** 新增 modal click */
    function addModalClick(selectDate: Date) {
        setPageState(prev => ({
            ...prev,
            modelOpen: true,
            modelInner: {
                title: "添加行事曆",
                modelInner: "123",
                size: "large"
            }
        }))

    }

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
                                    eventType: GCCalenderEnums.eventType.CHIPCARD,
                                    contextMenuList: [
                                        {
                                            content: () => '操作選單',
                                            style: { fontWeight: '700', borderBottom: "1px solid #e0e0e0" },
                                        },
                                        {
                                            content: () => `車牌號碼:`
                                        },
                                        {
                                            content: () => `美容服務:`
                                        },
                                        {
                                            content: () => `預約接待: `
                                        },
                                        {
                                            content: () => `狀態:`
                                        },
                                        {
                                            id: 'edit',
                                            icon: <Edit color="secondary" />,
                                            content: () => '編輯與查看',
                                            onClick: (item: GCCalenderDataType) => { }
                                        },
                                        {
                                            id: 'delete',
                                            icon: <Delete color="error" />,
                                            content: () => '取消預約',
                                            onClick: (item: GCCalenderDataType) => { }
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