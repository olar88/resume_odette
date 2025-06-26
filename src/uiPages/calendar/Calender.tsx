import React, { useState, useEffect, forwardRef, useRef, MouseEvent, useImperativeHandle } from "react";
import { DatePicker, DatePickerProps, DateTimePickerProps } from "@mui/lab";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ArrowLeft, ArrowRight, NavigateBefore, NavigateNext } from "@mui/icons-material";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import { CardProps } from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Button, ButtonGroup, Theme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material";
import { zhTW } from "@mui/x-date-pickers/locales";
import './CalenderCSS.css';
import { HandleEvent, OptionListType, DateTimeFormate } from "./types";
import TextButton from "../../components/TextButton";

// #region type 
/** (新) 預約月曆 ref InterFace 
 * @param handleViewModeChange 切換月曆使用模式
 * @param getCalenderDate 取得目前起末日期
 * @param getCalenderDateArr 取得目前日曆呈現日期陣列
*/
export interface GCCalenderInterFace {
    /** 切換月曆使用模式 */
    handleViewModeChange: (mode: viewMode) => void
    /** 取得目前起末日期 */
    getCalenderDate: () => Promise<({
        /** 起始日 */
        currentCalenderTimeStart: string,
        /** 結束日 */
        currentCalenderTimeEnd: string
    })>
    /** 取得目前日曆呈現日期陣列 */
    getCalenderDateArr: () => Promise<Date[]>
}

/** (新) 預約月曆 Props 
 * @property {string} primaryTitle - 月曆的主標題。
 * @property {string} dateStart - 月曆的起始日期。（可選）
 * @property {string} dateEnd - 月曆的結束日期。（可選）
 * @property {string} timeStart - 月曆的起始時間。（可選）
 * @property {string} timeEnd - 月曆的結束時間。（可選）
 * @property {string[]} disableDateArr - 不能選擇的特定日期的數組。
 * @property {{ year: number | null, month: number | null, day: number | null }} [disableDateSet] - 指定從哪個日期開始不能操作。
 * @property {viewMode[]} viewMode - 檢視模式陣列（第0項為預設）（月/日）。
 * @property {timeMode} timeMode - 時間呈現模式 (FULL 24小時制/HALF 12小時制)。
 * @property {usingMode} usingMode - 目前模式（編輯/查看）。
 * @property {Object} DatePickerButtonSet - 日曆選取日期按鈕。
 * @property {boolean} DatePickerButtonSet.display - 是否顯示。
 * @property {React.HTMLInputTypeAttribute} DatePickerButtonSet.type - 選取類型。
 * @property {(timeStart: string, timeEnd: string) => void} [asyncCalenderDate] - 同步日期的函數。
 * @property {ContextMenuListType[]} [dateContextMenuList] - 日期（上方日期）右鍵選單內容。
 * @property {(date: Date, dataItem: GCCalenderDataType) => void} [dayCustomClickEvent] - 編輯模式月曆格子點擊事件。
 * @property {ContextMenuListType[]} [dayCustomContextMenuEvent] - 編輯模式月曆格子右鍵選單內容。
 * @property {() => void} invalidEvent - 無法編輯提示日期方格點擊事件。
 * @property {GCCalenderDataType[]} data - 資料。
 * @see {@link GCCalenderDataType} 
 * @see {@link ContextMenuListType} 
*/
type GCCalenderProps = {
    /** 月曆主標題 */
    primaryTitle: string,
    /** 月曆起始日期 */
    dateStart?: string,
    /** 月曆結束日期 */
    dateEnd?: string,
    /** 月曆起始時間 */
    timeStart?: string,
    /** 月曆結束時間 */
    timeEnd?: string,
    /** 指定的不能操作的日期陣列 */
    disableDateArr?: string[],
    /** 指定哪個日期開始不能操作 */
    disableDateSet?: { year: number | null, month: number | null; day: number | null }
    /** 檢視模式陣列(第0項為預設) (月/日) */
    viewMode: viewMode[],
    /** 時間呈現模式 (FULL 24小時制/HALF 12小時制) */
    timeMode: timeMode,
    /** 目前模式 (編輯/查看) */
    usingMode: usingMode,
    /** 日曆選取日期鈕 */
    DatePickerButtonSet: {
        /** 是否顯示 */
        display: boolean,
        /** 選取type  */
        type: React.HTMLInputTypeAttribute,
    }
    /** 同步日期 */
    asyncCalenderDate?: (
        /** 起始日 */
        timeStart: string,
        /** 結束日 */
        timeEnd: string) => Promise<void>,
    /** 日期(上方日期)右鍵 選單內容 */
    dateContextMenuList?: ContextMenuListType[],
    /** 編輯模式月曆格子點擊事件 */
    dayCustomClickEvent?: (date: Date, dataItem: GCCalenderDataType) => void
    /** 編輯模式月曆格子右鍵 選單內容 */
    dayCustomContextMenuEvent?: ContextMenuListType[]
    /** 無法編輯提示 日期方格點擊 event */
    invalidEvent: () => void,
    /** 資料 */
    data: GCCalenderDataType[]
}

/** (新) 預約月曆 - 資料 
 * @property {string} dataId - 資料 id
 * @property {string} name - 資料名稱 (會顯示)
 * @property {string} collapse - 此行資料於"月檢視"模式是否可展開查看時間軸table
 * @property {string} eventDataArr - 資料 所含事件陣列
 * ---
 * @param eventDataArr - 資料 所含活動陣列
 * @property {string} eventId - 活動 id
 * @property {string} eventContent - 活動 id
 * @property {eventType} eventType - 活動 型態 {@link eventType}
 * @property {string} startTime - 活動 開始時間
 * @property {string} endTime - 活動 結束時間
 * @property {GCCalenderColor} status - 活動 狀態(顏色) {@link GCCalenderColor}
 * @property {ContextMenuListType[]} contextMenuList - 活動 右鍵 contextMenu 資料 {@link ContextMenuListType}
 * @property {Funciton} onClick - 活動 左鍵點擊事件
*/
export type GCCalenderDataType = {
    dataId: string,
    name: React.ReactNode,
    /** 是否查看月檢視模式-時間線子table */
    collapse: boolean,
    eventDataArr: {
        eventId: string,
        eventContent: React.ReactNode,
        eventType: eventType,
        startTime: string,
        endTime?: string,
        status?: GCCalenderColor,
        contextMenuList?: ContextMenuListType[],
        onClick?: (T?: any) => void
    }[]

}

/** (右鍵) contextMenu 資料type 
 * @property {ReactNode} id - id
 * @property {ReactNode} icon - 最前方 iocn
 * @property {Funciton} content - 內容
 * @property {React.CSSProperties} style - css style
 * @property {Funciton} onClick - 左鍵點擊事件
*/
type ContextMenuListType = {
    id?: React.ReactNode,
    icon?: React.ReactNode,
    content: (T?: any) => React.ReactNode,
    style?: React.CSSProperties;
    onClick?: (T?: any) => void
}
// #endregion

// #region enum 
/** 目前模式 
 * @param EDITONLY 編輯模式
 * @param READONLY 查看模式
*/
enum usingMode {
    /** 編輯模式 */
    EDITONLY = "editonly",
    /** 查看模式 */
    READONLY = "readonly",
}

/** 目前檢視模式 
 * @param MONTH 月
 * @param DAY 日
*/
enum viewMode {
    /** 月 */
    MONTH = "MONTH",
    /** 日 */
    DAY = "day",
}

/** 時間呈現模式 
 * @param FULL 24小時制
 * @param HALF 12小時制
*/
enum timeMode {
    /** 月 */
    FULL = "FULL",
    /** 日 */
    HALF = "HALF",
}

/** 月曆事件模式
 * @param CHIPCARD 單日 時段事件
 * @param CHIPBAR 跨日 時段事件
 * @param SINGELDAY 單日事件
 * @param TIP 單日 外框提示事件
*/
export enum eventType {
    /** 單日時段事件 */
    CHIPCARD = "chipCard",
    /** 跨日時段事件 */
    CHIPBAR = "chipBar",
    /** 單日事件 */
    SINGELDAY = "singleDay",
    /** 單日外框提示事件 */
    TIP = "tip",
}

/** 月曆事件顏色 */
export enum GCCalenderColor {
    INFO = '#5dadaa',
    SECONDARY = '#a8d0e6',
    ERROR = '#f76c6c',
    WARNING = '#f8e9a1',
    DEFAULT = '#a7aec9',
    WHITE = '#fff',
}

/** GC 月曆使用列舉們 */
export const GCCalenderEnums = {
    viewMode,
    usingMode,
    GCCalenderColor,
    eventType,
    timeMode
}


const
    /** 平行 - 事件位移單位 */
    widthDisPlaceUnit = 235.8,
    /** 垂直 - 事件位移單位 */
    heightDisPlaceUnit = 30.17,
    /** 垂直 - 事件單位(1分鐘 = 1px) */
    heightEventUnit = 1

// #endregion

// #region functions 
/**取得天數陣列
 * @description 取得天數陣列
 * @returns Date[]
 */
export function getDateArr(currentCalenderTimeStart: string, currentCalenderTimeEnd: string) {
    // 取得顯示的天數
    let dateStartStr = new Date(DateTimeFormate.dateFormate({ dateStr: currentCalenderTimeStart })),
        dateEndStr = new Date(DateTimeFormate.dateFormate({ dateStr: currentCalenderTimeEnd })),
        dateRage = ((dateEndStr.getTime() - dateStartStr.getTime()) / 1000 / 60 / 60 / 24 + 1),
        dateStart = new Date(DateTimeFormate.dateFormate({ dateStr: currentCalenderTimeStart })),
        dateArr: Date[] = [];

    for (let i = dateStart.getDate(); i < dateRage + dateStart.getDate(); i++) {
        let date = new Date(dateStart)
        date.setDate(i);
        dateArr.push(date);
    }
    return dateArr
}

/** 取得星期 */
function getWeakDay(dayNum: number) {
    /** 星期陣列 */
    const weakDayArr = [{ val: 1, text: "一" }, { val: 2, text: "二" }, { val: 3, text: "三" }, { val: 4, text: "四" }, { val: 5, text: "五" }, { val: 6, text: "六" }, { val: 0, text: "日" }];
    return weakDayArr.find(day => day.val === dayNum)?.text || '取得錯誤'
}

/** 取得是否為今日 */
function getIsToday(checkDay: Date) {
    return DateTimeFormate.dateToString({ date: new Date(), mode: DateTimeFormate.DateMode.yyyyMMdd }) === DateTimeFormate.dateToString({ date: checkDay, mode: DateTimeFormate.DateMode.yyyyMMdd })
}

/** 取得跨日事件 左邊位置 
 * @param eventStartDay 事件開始日期
 * @param eventEndDay 事件結束日期
 * @param dateStart 月曆起始日期
 * @param dateEnd 月曆結束日期
*/
function getLeftPosition({ eventStartDay, dateStart, dateEnd }: { eventStartDay: string, dateStart: string, dateEnd: string, }) {
    const monthStart = new Date(DateTimeFormate.dateFormate({ dateStr: dateStart, Mode: DateTimeFormate.DateMode.yyyyMMdd })),
        monthEnd = new Date(DateTimeFormate.dateFormate({ dateStr: dateEnd, Mode: DateTimeFormate.DateMode.yyyyMMdd })),
        startDate = new Date(DateTimeFormate.dateFormate({ dateStr: eventStartDay, Mode: DateTimeFormate.DateMode.yyyyMMdd }))
    // 判斷是否於本月
    if (monthStart.getTime() <= startDate.getTime() && monthEnd.getTime() >= startDate.getTime()) {
        return widthDisPlaceUnit * (Math.floor((startDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)))
        // 判斷是否前面時間開始
    } else if (monthStart.getTime() > startDate.getTime()) {
        return -widthDisPlaceUnit
    }
    // 判斷是否後面時間開始
    else {
        return -widthDisPlaceUnit
    }
}

/** 取得跨日事件 右邊位置 
 * @param eventStartDay 事件開始日期
 * @param eventEndDay 事件結束日期
 * @param dateStart 月曆起始日期
 * @param dateEnd 月曆結束日期
*/
function getRightPosition({ eventStartDay, eventEndDay, dateStart, dateEnd }: { eventStartDay: string, eventEndDay?: string, dateStart: string, dateEnd: string }) {
    if (eventEndDay) {
        const monthStart = new Date(DateTimeFormate.dateFormate({ dateStr: dateStart, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
            monthEnd = new Date(DateTimeFormate.dateFormate({ dateStr: dateEnd, Mode: DateTimeFormate.DateMode.yyyyMMdd })),
            startDate = new Date(DateTimeFormate.dateFormate({ dateStr: eventStartDay, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
            endDate = new Date(DateTimeFormate.dateFormate({ dateStr: eventEndDay, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm }))
        if (monthStart.getTime() <= endDate.getTime() && monthEnd.getTime() >= endDate.getTime()) {
            return widthDisPlaceUnit * (Math.floor((monthEnd.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) + 10
        } else if (endDate.getTime() > monthEnd.getTime() && startDate.getTime() < monthEnd.getTime()) {
            return '0px'
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

/** 判斷是否為指定的不能操作的日期 
 * @returns boolean 可以操作(預設皆可操作)
*/
function getIsValidDate(today: Date, disableDateArr: string[], disableDateSet?: { year: number | null, month: number | null; day: number | null }) {
    let isValid = true
    for (let disableDate of disableDateArr) {
        if (new Date(DateTimeFormate.dateFormate({ dateStr: disableDate, Mode: DateTimeFormate.DateMode.yyyyMMdd })).getTime() === today.getTime()) {
            isValid = false
        }
    }
    if (disableDateSet &&
        today.getTime() < new Date(DateTimeFormate.dateFormate({
            dateStr: DateTimeFormate.getDisableDate(disableDateSet.year || 0, disableDateSet.month || 0, disableDateSet.day || 0),
            Mode: DateTimeFormate.DateMode.yyyyMMdd,
        })).getTime()) {
        isValid = false
    }
    return isValid
}

/** 取得所有日期下月份以及其colSpan */
function getTotalMonth(dateArr: Date[]) {
    let monthArr: {
        name: string,
        colSpan: number,
    }[] = []
    for (let date of dateArr) {
        let yearMonth = DateTimeFormate.dateToString({ date: date, mode: DateTimeFormate.DateMode.yyyyMM })
        if (!monthArr.some(ele => ele.name === yearMonth)) {
            monthArr.push({
                name: yearMonth,
                colSpan: 1,
            })
        } else {
            monthArr[monthArr.findIndex(ele => ele.name === yearMonth)].colSpan++
        }
    }
    return monthArr
}
// #endregion

// #region GCCalender
/** (新) 預約月曆 
 * @description 手機版檢視操作方式"右鍵"喚出選單模式改為"雙擊"喚出
 * @description 各項開關請查看 {@link GCCalenderProps} 詳細說明
 * @description ref type {@link GCCalenderInterFace}
 * @author Olar
 */
export const GCCalender = forwardRef<GCCalenderInterFace, GCCalenderProps>((props, ref) => {
    const tableRef = useRef<HTMLTableElement>(null);
    // 呈現之日期陣列
    const [dateArr, setDateArr] = useState<Date[]>([])
    // 目前月曆呈現真正時間(起始日)預設: 日檢視-當天; 月檢視-當月第一天
    const [currentCalenderTimeStart, setCurrentCalenderTimeStart] = useState<string>(props.viewMode[0] === GCCalenderEnums.viewMode.MONTH
        ? props.dateStart || DateTimeFormate.dateToString({ date: DateTimeFormate.getMonthStart(new Date()), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' })
        : DateTimeFormate.dateToString({ date: new Date(), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' }))
    // 目前月曆呈現(結束日)預設: 日檢視-無效; 月檢視-當月最後一天
    const [currentCalenderTimeEnd, setCurrentCalenderTimeEnd] = useState<string>(props.dateEnd || DateTimeFormate.dateToString({ date: DateTimeFormate.getMonthEnd(new Date()), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' }))

    // 目前使用模式 月/日
    const [currentViewMode, setCurrentViewMode] = useState<viewMode>(props.viewMode[0])

    // 目前那些資料正被展開
    const [monthTimedataCollapse, setMonthTimedataCollapse] = useState<OptionListType[]>([])

    // 右鍵 context Menu 參數
    const [contextMenuData, setContextMenuData] = useState<{
        open: boolean,
        style: React.CSSProperties | undefined,
        positionX: number,
        positionY: number,
        contextMenuList: ContextMenuListType[]
    }>({
        open: false,
        style: undefined,
        positionX: 0,
        positionY: 0,
        contextMenuList: [],
    })

    //是否展開左右卷軸鍵
    const [isOpenScroll, setIsOpenScroll] = useState<{
        left: boolean,
        right: boolean,
    }>({
        left: false,
        right: false,
    })
    /** "sm" MUI 提供分頁斷點位置 hook */
    const isMobile = useMediaQuery((theme: Theme) => theme?.breakpoints.down('sm'));

    useImperativeHandle(ref, () => ({
        /** 切換月曆使用模式 */
        handleViewModeChange: handleViewModeChange,
        /** 取得目前起末日期 */
        getCalenderDate: async () => ({ currentCalenderTimeStart, currentCalenderTimeEnd }),
        /** 取得目前日曆呈現日期陣列 */
        getCalenderDateArr: async () => dateArr
    }));

    //#region handle functions
    /** 切換月曆使用模式 */
    function handleViewModeChange(mode: viewMode) {
        setCurrentViewMode(prev => mode === prev ? prev : mode)
        // 切換模式同時重新設定起始日 : 日檢視:當天,月檢視:當月第一天)
        setCurrentCalenderTimeStart(prev => mode === GCCalenderEnums.viewMode.MONTH
            ? props.dateStart || DateTimeFormate.dateToString({ date: DateTimeFormate.getMonthStart(new Date()), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' })
            : props.dateStart || DateTimeFormate.dateToString({ date: new Date(), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' }))
        setCurrentCalenderTimeEnd(props.dateEnd || DateTimeFormate.dateToString({ date: DateTimeFormate.getMonthEnd(new Date()), mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '' }))
    }

    /** 主動選取 目前查看月份 
     * @description 含當時間起迄前後順序錯位
    */
    function handleDateInput(e: HandleEvent, type: "start" | 'end') {
        if (props.DatePickerButtonSet.type === 'date' && currentViewMode === GCCalenderEnums.viewMode.MONTH) {
            if (type === "start") {
                setCurrentCalenderTimeStart(prev => {
                    const newDate = new Date(e.target.value),
                        oldEndDate = new Date(DateTimeFormate.dateFormate({
                            dateStr: currentCalenderTimeEnd,
                            Mode: DateTimeFormate.DateMode.yyyyMMdd,
                        }))
                    if (newDate.getTime() < oldEndDate.getTime()) {
                        return DateTimeFormate.dateToString({
                            date: e.target.value,
                            mode: DateTimeFormate.DateMode.yyyyMMdd,
                            joinDate: '-'
                        })
                    } else {
                        window.alert('時間起需於時間迄前')
                        return prev
                    }
                })
            } else if (type === "end") {
                setCurrentCalenderTimeEnd(prev => {
                    const newDate = new Date(e.target.value),
                        oldStartDate = new Date(DateTimeFormate.dateFormate({
                            dateStr: currentCalenderTimeStart,
                            Mode: DateTimeFormate.DateMode.yyyyMMdd,
                        }))
                    if (newDate.getTime() > oldStartDate.getTime()) {
                        return DateTimeFormate.dateToString({
                            date: e.target.value,
                            mode: DateTimeFormate.DateMode.yyyyMMdd,
                            joinDate: '-'
                        })
                    } else {
                        window.alert('時間迄需於時間起後')
                        return prev
                    }
                })
            } else {
                console.log('handleDateInput type error', type);
            }
        } else if (currentViewMode === GCCalenderEnums.viewMode.MONTH) {
            setCurrentCalenderTimeStart(DateTimeFormate.dateToString({
                date: DateTimeFormate.getMonthStart(e.target.value),
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: '-'
            }))
            setCurrentCalenderTimeEnd(DateTimeFormate.dateToString({
                date: DateTimeFormate.getMonthEnd(e.target.value),
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: '-'
            }))
        } else if (currentViewMode === GCCalenderEnums.viewMode.DAY) {
            console.log('viewMode DAY', e.target.value, ':::123:::', DateTimeFormate.getMonthEnd(e.target.value));

            setCurrentCalenderTimeStart(DateTimeFormate.dateToString({
                date: e.target.value,
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: '-'
            }))
            setCurrentCalenderTimeEnd(DateTimeFormate.dateToString({
                date: DateTimeFormate.getMonthEnd(e.target.value),
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: '-'
            }))
        }
    }

    /** 點擊前後鍵選取 目前查看月份 */
    function handleMonthClick(action: number) {
        setCurrentCalenderTimeStart(prev => {
            const prevDate: Date = new Date(
                DateTimeFormate.dateFormate({
                    dateStr: prev,
                    Mode: DateTimeFormate.DateMode.yyyyMMdd,
                    joinDate: '-'
                })
            ),
                start = new Date(prevDate.getFullYear(), prevDate.getMonth() + action, 1);
            return DateTimeFormate.dateToString({
                date: start,
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: ''
            })
        });
        setCurrentCalenderTimeEnd(prev => {
            const prevDate: Date = new Date(
                DateTimeFormate.dateFormate({
                    dateStr: prev,
                    Mode: DateTimeFormate.DateMode.yyyyMMdd,
                })
            ),
                end = new Date(prevDate.getFullYear(), prevDate.getMonth() + action + 1, 0);
            return DateTimeFormate.dateToString({
                date: end,
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: ''
            })
        })
    }

    /** 點擊前後鍵選取 目前查看日期 */
    function handleDateClick(action: number) {
        setCurrentCalenderTimeStart(prev => {
            const prevDate: Date = new Date(
                DateTimeFormate.dateFormate({
                    dateStr: prev,
                    Mode: DateTimeFormate.DateMode.yyyyMMdd,
                    joinDate: '-'
                })
            )
            setCurrentCalenderTimeEnd(DateTimeFormate.dateToString({
                date: DateTimeFormate.getMonthEnd(prevDate),
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: '-'
            }))
            return DateTimeFormate.dateToString({
                date: new Date(prevDate.setDate(prevDate.getDate() + action)),
                mode: DateTimeFormate.DateMode.yyyyMMdd,
                joinDate: ''
            })
        });
    }
    //#endregion

    //#region click functions
    /** 重新判斷資料開合 */
    function autoSetCollapse() {
        setMonthTimedataCollapse(prev => props.data.filter(ele => ele.collapse).map((item, index) => {
            if (prev.some(ele => ele.name === item.dataId)) {
                return prev.find(ele => ele.name === item.dataId)!
            } else return { name: item.dataId, value: 'N' }
        }));
    }

    /** 手動 資料開合 */
    function handleTableRow(elem: GCCalenderProps['data'][number]) {
        // 處理展開收合
        if (monthTimedataCollapse.length) {
            setMonthTimedataCollapse(prev => {
                //將新陣列設定進 DataToggleOpening
                return prev.map(item => ({
                    ...item,
                    // 點擊物件不為Y, 則設定Y, 其餘狀況皆設為 N
                    value: elem.dataId === item.name && item.value !== 'Y'
                        ? "Y" : "N"
                }))
            })
        } else {
            console.error("No Calender collapse Data", monthTimedataCollapse);
        }
    }

    /** 右鍵點擊展開 ContextMenu */
    function handleDateOpenContextMenu(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, MenuList?: ContextMenuListType[], T?: any) {
        if (MenuList && MenuList.length && props.usingMode === usingMode.EDITONLY) {
            setContextMenuData({
                open: true,
                style: undefined,
                positionX: e.clientX,
                positionY: e.clientY,
                contextMenuList: MenuList?.map(ele => ({
                    ...ele,
                    content: ele.content && (() => ele.content!(T)),
                    onClick: ele.onClick && (() => ele.onClick!(T))
                })) || []
            })
        }
    }

    /** 關閉 ContextMenu */
    function handleCloseContextMenu() {
        setContextMenuData({
            open: false,
            style: undefined,
            positionX: 0,
            positionY: 0,
            contextMenuList: []
        })
    }

    /** 左右滑動按鈕點擊 */
    function handleScroll(direct: 'left' | 'right') {
        if (tableRef.current) {
            const container = tableRef.current;
            const newScrollLeft = container.scrollLeft + (direct === 'left' ? (-1648.5) : (+1648.5));
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            container.scrollTo({
                left: Math.min(newScrollLeft, maxScrollLeft),
                behavior: 'smooth', // 添加平滑滾動效果
            });
        }
    }
    //#endregion

    //#region useEffect
    useEffect(() => {
        setDateArr(getDateArr(currentCalenderTimeStart, currentCalenderTimeEnd))
    }, [currentCalenderTimeStart, currentCalenderTimeEnd])

    // 資料變更重新收合
    useEffect(() => {
        autoSetCollapse()
    }, [props.data])

    useEffect(() => {
        window.addEventListener('mousedown', () => { handleCloseContextMenu() })
    }, [])

    // 同步父層日期
    useEffect(() => {
        if (props.asyncCalenderDate) {
            props.asyncCalenderDate(currentCalenderTimeStart, currentCalenderTimeEnd)
        }
    }, [currentCalenderTimeEnd, currentCalenderTimeStart])

    useEffect(() => {
        if (isMobile) {
            handleViewModeChange(viewMode.MONTH)
        } else {
            handleViewModeChange(props.viewMode[0])
        }
    }, [isMobile])

    //#endregion

    return <React.Fragment>
        <div id='GCCalender' className="w-100"
            style={{
                position: 'relative',
                border: `1px solid #0000001F`,
                borderRadius: '6px 6px 0px 0px',
                transition: '.2s'
            }}>
            {/* 日期切換區 */}
            <div className="w-100 h-60 GCCalenderTablePadding bg-white sticky_left d-flex alignItems-center justifyContent-between" >

                {/* 日期區 */}
                <div className="d-flex alignItems-center" style={{ gap: '10px' }}>
                    {// 當開啟並檢視模式為"月"
                        props.DatePickerButtonSet.display && currentViewMode === GCCalenderEnums.viewMode.MONTH
                            ? <React.Fragment>
                                {/* 前後月份控制器 */}
                                {// 選擇器若為"月份"則顯示
                                    props.DatePickerButtonSet.type === 'month'
                                        ? <React.Fragment>
                                            <CommonFcnButton
                                                variant="outlined"
                                                size='small'
                                                children={<NavigateBefore style={{ fill: '#727B97' }} />}
                                                onClick={() => handleMonthClick(-1)}
                                            />
                                            <CommonFcnButton
                                                variant="outlined"
                                                size='small'
                                                children={<NavigateNext style={{ fill: '#727B97' }} />}
                                                onClick={() => handleMonthClick(+1)}
                                            />
                                        </React.Fragment>
                                        : null}

                                {/* 時間起控制器 */}
                                <DatePickerButton
                                    id="time"
                                    name=''
                                    // 手機版不開放跨月檢視
                                    type={isMobile ? 'month' : props.DatePickerButtonSet.type}
                                    value={currentCalenderTimeStart}
                                    onChange={(e: HandleEvent) => { handleDateInput(e, 'start') }}
                                />

                                {/* 時間迄控制器 */}
                                {// 選擇器若為"日期"則顯示 (手機版不開放跨月檢視)
                                    !isMobile && props.DatePickerButtonSet.type === 'date'
                                        ? <React.Fragment>
                                            -
                                            <DatePickerButton
                                                id="time"
                                                name=''
                                                type={props.DatePickerButtonSet.type}
                                                value={currentCalenderTimeEnd}
                                                onChange={(e: HandleEvent) => { handleDateInput(e, 'end') }}
                                            />
                                        </React.Fragment>
                                        : null}
                            </React.Fragment>
                            : null}
                    { // 當開啟並檢視模式為"日"
                        props.DatePickerButtonSet.display && currentViewMode === GCCalenderEnums.viewMode.DAY
                            ? <React.Fragment>
                                <CommonFcnButton
                                    variant="outlined"
                                    size='small'
                                    children={<NavigateBefore style={{ fill: '#727B97' }} />}
                                    onClick={() => handleDateClick(-1)}
                                />
                                <CommonFcnButton
                                    variant="outlined"
                                    size='small'
                                    children={<NavigateNext style={{ fill: '#727B97' }} />}
                                    onClick={() => handleDateClick(+1)}
                                />
                                <DatePickerButton
                                    id="time"
                                    name=''
                                    type={'date'}
                                    value={currentCalenderTimeStart}
                                    onChange={(e: HandleEvent) => { handleDateInput(e, 'start') }}
                                />
                            </React.Fragment>
                            : null}
                </div>

                {/* 使用模式區 手機版僅開放月檢視*/}
                {isMobile
                    ? null
                    : <div className="d-flex alignItems-center" >
                        <ButtonGroup disableElevation
                            variant="contained"
                            style={{ fill: '#7F92CC' }}>
                            {props.viewMode.map(ele =>
                                <CommonFcnButton
                                    key={ele}
                                    className={currentViewMode === ele ? "active" : ''}
                                    variant="outlined"
                                    size='small'
                                    children={ele === viewMode.MONTH ? '月' : '日'}
                                    onClick={() => { handleViewModeChange(ele) }}
                                />
                            )}
                        </ButtonGroup>
                    </div>}
            </div>
            {/* 月曆區 */}
            {isMobile
                ? <TableMobileVersion
                    {...props}
                    dateArr={dateArr}
                    handleDateOpenContextMenu={handleDateOpenContextMenu}
                    handleTableRow={handleTableRow}
                    currentCalenderTimeStart={currentCalenderTimeStart}
                    currentCalenderTimeEnd={currentCalenderTimeEnd}
                    monthTimedataCollapse={monthTimedataCollapse}
                />
                : <React.Fragment>
                    <div className="GCCalender w-100"
                        style={{
                            overflow: 'auto',
                            position: 'relative',
                            maxHeight: '675px',
                        }}
                        ref={tableRef}>
                        {currentViewMode === GCCalenderEnums.viewMode.MONTH
                            ?//月檢視 
                            <TableMonthVersion
                                {...props}
                                dateArr={dateArr}
                                handleDateOpenContextMenu={handleDateOpenContextMenu}
                                handleTableRow={handleTableRow}
                                currentCalenderTimeStart={currentCalenderTimeStart}
                                currentCalenderTimeEnd={currentCalenderTimeEnd}
                                monthTimedataCollapse={monthTimedataCollapse}
                            />
                            : //日檢視
                            <TableDayVersion
                                {...props}
                                handleDateOpenContextMenu={handleDateOpenContextMenu}
                                currentDate={new Date(DateTimeFormate.dateFormate({
                                    dateStr: currentCalenderTimeStart,
                                    Mode: DateTimeFormate.DateMode.yyyyMMdd,
                                }))}
                            />
                        }
                    </div>
                    {/* 左右滑動按鈕 */}
                    <div className={"GCC_ScrollBar left " + (isOpenScroll.left ? 'show' : '')}
                        onMouseEnter={() => { setIsOpenScroll({ left: true, right: false }) }}
                        onMouseLeave={() => { setIsOpenScroll({ left: false, right: false }) }}
                        onClick={() => handleScroll('left')}
                    >
                        {isOpenScroll.left ? <ArrowLeft fontSize='large' style={{ color: '#fff' }} /> : null}
                    </div>
                    <div className={"GCC_ScrollBar right " + (isOpenScroll.right ? 'show' : '')}
                        onMouseEnter={() => { setIsOpenScroll({ right: true, left: false }) }}
                        onMouseLeave={() => { setIsOpenScroll({ left: false, right: false }) }}
                        onClick={() => handleScroll('right')}
                    >
                        {isOpenScroll.right ? <ArrowRight fontSize='large' style={{ color: '#fff' }} /> : null}
                    </div>
                </React.Fragment>}
        </div >

        {/* 右鍵點擊內容區塊 */}
        {contextMenuData.open
            ? <ContextMenuOfGCCalender
                {...contextMenuData}
                handleCloseContextMenu={handleCloseContextMenu}
            /> : null}
    </React.Fragment >
})

/** 月檢視 table 內容 */
function TableMonthVersion(props: GCCalenderProps & {
    dateArr: Date[],
    /** 右鍵點擊展開 ContextMenu */
    handleDateOpenContextMenu(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, MenuList?: ContextMenuListType[], T?: any): void    /** 手動 資料開合 */
    /** 手動 資料開合 */
    handleTableRow(elem: GCCalenderProps['data'][number]): void,
    /** 目前月曆呈現時間起 */
    currentCalenderTimeStart: string,
    /** 目前月曆呈現時間迄 */
    currentCalenderTimeEnd: string,
    /** 目前那些資料正被展開 */
    monthTimedataCollapse: OptionListType[]

}) {
    const { dateArr, handleDateOpenContextMenu, handleTableRow, currentCalenderTimeStart, currentCalenderTimeEnd, monthTimedataCollapse } = props
    // 將畫面捲動至對應視窗
    useEffect(() => {
        document.getElementById('GCCalender_now_Month')?.scrollIntoView()
    }, [document.getElementById('GCCalender_now_Month')])
    /** 時間選單 */
    const timeRangeArr = getCodeListTime({ timeStart: props.timeStart, timeEnd: props.timeEnd })

    return < table className="GCCalenderTable">
        {/* TableHead */}
        <TableHeadOfCalendar >
            <TableRowOfCalendar
                style={{ height: 'fit-content' }}>
                {/* table title*/}
                <TableHeadCellOfCalendar
                    className='sticky_left '
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    rowSpan={2}
                >
                    <MajorTitle>
                        {props.primaryTitle}
                    </MajorTitle>
                </TableHeadCellOfCalendar>
                {/* 橫向 年月 thead */}
                {getTotalMonth(dateArr).map((yearMonthItem) => {
                    return <TableHeadCellOfCalendar
                        key={yearMonthItem.name}
                        style={{ width: '100%', textAlign: 'left' }}
                        colSpan={yearMonthItem.colSpan}
                    >
                        <div style={{ width: '100%', position: 'relative' }}>
                            <div style={{
                                position: 'sticky',
                                left: widthDisPlaceUnit + 10,
                                display: 'inline-block'
                            }}>
                                {yearMonthItem.name}
                            </div>
                        </div>

                    </TableHeadCellOfCalendar>

                })}
            </TableRowOfCalendar>
            <TableRowOfCalendar>
                {/* 橫向 日 thead */}
                {dateArr.map((dateItem, dateIndex) => {
                    const isToday: boolean = getIsToday(dateItem),
                        isHoliday: boolean = dateItem.getDay() === 0 || dateItem.getDay() === 6,
                        /** 為不能操作的日期 */
                        valid = props.disableDateArr ? getIsValidDate(dateItem, props.disableDateArr, props.disableDateSet) : true

                    return <TableHeadCellOfCalendar
                        key={dateItem.getTime()}
                        id={isToday ? 'GCCalender_now_Month' : ''}
                        className={(isToday ? 'GCCalenderNowTime ' : '') +
                            (isHoliday ? ' GCCalenderHoliday' : '') +
                            (valid ? '' : ' GCCalenderDisabled')
                        }
                        style={{
                            gap: '4px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                        onContextMenu={props.usingMode === usingMode.EDITONLY
                            ? (e) => {
                                if (!valid) {
                                    props.invalidEvent()
                                } else if (props.dateContextMenuList) {
                                    handleDateOpenContextMenu(e, props.dateContextMenuList, dateItem)
                                }
                            }
                            : undefined}
                    >
                        <MinorTitle>
                            {getWeakDay(dateItem.getDay())}
                        </MinorTitle>
                        <MajorTitle>
                            {dateItem.getDate()}
                        </MajorTitle>
                    </TableHeadCellOfCalendar>
                })}
            </TableRowOfCalendar>
        </TableHeadOfCalendar>

        {/* TableBody */}
        <tbody>
            {props.data.map((dataItem, dataIndex) => {
                // 先將資料排序好 (避免) 重疊醜醜的狀況
                dataItem.eventDataArr.sort((a, b) => Number(a.startTime) - Number(b.startTime))
                const
                    /** CHIPBAR 資料 */
                    chipBarData = dataItem.eventDataArr.filter(ele => ele.eventType === eventType.CHIPBAR && (ele.startTime || ele.endTime))
                return <React.Fragment key={dataItem.dataId}>
                    {/* 月-資料 */}
                    <TableRowOfCalendar
                        style={{ position: 'relative' }}>
                        {/* 縱向-資料 */}
                        <TableHeadCellOfCalendar
                            className='sticky_left'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            onClick={() => handleTableRow(dataItem)}
                        >
                            <MinorTitle children={dataItem.name} />
                        </TableHeadCellOfCalendar>

                        {/* 月曆格子 */}
                        <td colSpan={dateArr.length} style={{ padding: '0', position: 'relative' }}>
                            <table className="GCCalenderTable" style={{ margin: '-.8px' }}>
                                <tbody>
                                    <tr>
                                        {dateArr.map((date, dataIndex) => {
                                            // 先將資料排序好 (避免) 重疊醜醜的狀況
                                            dataItem.eventDataArr.sort((a, b) => Number(a.startTime) - Number(b.startTime))
                                            /** CHIPCARD 資料 */
                                            const chiCardData = dataItem.eventDataArr.filter(ele =>
                                                new Date(DateTimeFormate.dateFormate({ dateStr: ele.startTime, Mode: DateTimeFormate.DateMode.yyyyMMdd })).toString() === date.toString() &&
                                                ele.eventType === eventType.CHIPCARD),
                                                /** TIP 資料 */
                                                tipData = dataItem.eventDataArr.filter(ele => new Date(DateTimeFormate.dateFormate({ dateStr: ele.startTime, Mode: DateTimeFormate.DateMode.yyyyMMdd })).toString() === date.toString() &&
                                                    ele.eventType === GCCalenderEnums.eventType.TIP),
                                                /** 為不能操作的日期 */
                                                valid = props.disableDateArr ? getIsValidDate(date, props.disableDateArr, props.disableDateSet) : true,
                                                /** SINGELDAY 資料 */
                                                singleDayData = dataItem.eventDataArr.find(ele => ele.eventType === eventType.SINGELDAY &&
                                                    new Date(DateTimeFormate.dateFormate({ dateStr: ele.startTime, Mode: DateTimeFormate.DateMode.yyyyMMdd })).toString() === date.toString())
                                            return (
                                                <TableCellOfCalendar
                                                    key={dataItem.dataId + date.getTime()}
                                                    className={valid ? '' : ' GCCalenderDisabled'}
                                                    style={{
                                                        flexWrap: 'wrap', gap: '4px', border: 'none', position: 'relative',
                                                    }}
                                                    onClick={props.usingMode === usingMode.EDITONLY
                                                        ? (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            if (!valid) {
                                                                props.invalidEvent()
                                                            } else if (props.dayCustomClickEvent) {
                                                                props.dayCustomClickEvent(date, dataItem)
                                                            }
                                                        }
                                                        : undefined}
                                                    onContextMenu={props.usingMode === usingMode.EDITONLY
                                                        ? (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            if (!valid) {
                                                                props.invalidEvent()
                                                            } else if (props.dayCustomContextMenuEvent) {
                                                                handleDateOpenContextMenu(e, props.dayCustomContextMenuEvent, date)
                                                            }
                                                        }
                                                        : undefined}
                                                >
                                                    {/* CHIPCARD */}
                                                    {chiCardData.length
                                                        ? chiCardData.slice(0, 2).map((eventItem, eventIndex) =>
                                                            <ChipOfGCCalender
                                                                style={{ height: '24px' }}
                                                                key={eventItem.eventId}
                                                                size={'small'}
                                                                label={DateTimeFormate.dateFormate({ dateStr: eventItem.startTime, Mode: DateTimeFormate.DateMode.hhmm })
                                                                    + '~' +
                                                                    DateTimeFormate.dateFormate({ dateStr: eventItem.endTime || '', Mode: DateTimeFormate.DateMode.hhmm })
                                                                }
                                                                clickable={'false'}
                                                                chipColor={eventItem.status || GCCalenderEnums.GCCalenderColor.INFO}
                                                                onContextMenu={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    handleDateOpenContextMenu(e, eventItem.contextMenuList, eventItem)
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    if (eventItem.onClick && props.usingMode === usingMode.EDITONLY) {
                                                                        eventItem.onClick(eventItem)
                                                                    }
                                                                }}
                                                            />)
                                                        : null}
                                                    {(chiCardData.length - 2) > 0
                                                        ? <Button children={(chiCardData.length - 2) + '+'} size={'small'} style={{ margin: '1px', minWidth: '14px' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleTableRow(dataItem)
                                                            }} />
                                                        : null}

                                                    {/* SINGELDAY */}
                                                    {singleDayData
                                                        ? <VerticalCardOfGCCalender
                                                            key={singleDayData.eventId}
                                                            dateArr={props.dateArr}
                                                            timeRangeArr={timeRangeArr}
                                                            start_time={'1'}
                                                            end_time={'1'}
                                                            leftShift={0}
                                                            color={singleDayData.status || GCCalenderEnums.GCCalenderColor.INFO}
                                                            onContextMenu={props.usingMode === usingMode.EDITONLY
                                                                ? (e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    if (singleDayData.contextMenuList) {
                                                                        props.handleDateOpenContextMenu(e, singleDayData.contextMenuList, singleDayData)
                                                                    }
                                                                } : undefined}
                                                            onClick={props.usingMode === usingMode.EDITONLY
                                                                ? (e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    if (singleDayData.onClick && props.usingMode === usingMode.EDITONLY) {
                                                                        singleDayData.onClick(singleDayData)
                                                                    }
                                                                } : undefined}
                                                            children={singleDayData.eventContent}
                                                            isMobile={false}
                                                            style={{
                                                                margin: '0',
                                                            }}
                                                        />
                                                        : null}

                                                    {/* TIP */}
                                                    {tipData.length
                                                        ? tipData.map((eventItem, eventIndex) => {
                                                            return <div
                                                                key={eventItem.eventId}
                                                                className="GCC_Tip d-flex alignItems-center justifyContent-center"
                                                                style={{
                                                                    backgroundColor: eventItem.status ?? '#D9D9D9'
                                                                }}
                                                                onContextMenu={props.usingMode === usingMode.EDITONLY
                                                                    ? (e) => {
                                                                        e.preventDefault()
                                                                        e.stopPropagation()
                                                                        handleDateOpenContextMenu(e, eventItem.contextMenuList, eventItem)
                                                                    }
                                                                    : undefined}
                                                                onClick={eventItem.onClick && props.usingMode === usingMode.EDITONLY
                                                                    ? (e) => {
                                                                        e.preventDefault()
                                                                        e.stopPropagation()
                                                                        eventItem.onClick!(eventItem)
                                                                    }
                                                                    : undefined}
                                                            >
                                                                {eventItem.eventContent}
                                                            </div>
                                                        })
                                                        : null}

                                                </TableCellOfCalendar>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </table>

                            {/* CHIPBAR */}
                            {chipBarData.map((eventItem, eventIndex) => {
                                /** 左邊位置 */
                                const leftPosition = getLeftPosition({
                                    eventStartDay: eventItem.startTime,
                                    dateStart: currentCalenderTimeStart,
                                    dateEnd: currentCalenderTimeEnd
                                }),
                                    /** 右邊位置 */
                                    rightPosition = getRightPosition({
                                        eventStartDay: eventItem.startTime,
                                        eventEndDay: eventItem.endTime,
                                        dateStart: currentCalenderTimeStart,
                                        dateEnd: currentCalenderTimeEnd
                                    })
                                return <ChipOfGCCalender
                                    key={eventItem.eventId}
                                    style={{
                                        position: 'absolute',
                                        left: leftPosition,
                                        right: rightPosition,
                                        width: leftPosition > 0
                                            ? rightPosition
                                                ? undefined
                                                : widthDisPlaceUnit
                                            : rightPosition
                                                ? undefined
                                                : 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: 'fit-content',
                                        maxHeight: '36px'
                                    }}
                                    size={'small'}
                                    label={
                                        <div style={{ width: '100%', position: 'relative' }}>
                                            <div style={{
                                                position: 'sticky',
                                                left: widthDisPlaceUnit + 10,
                                                display: 'inline-block'
                                            }}>
                                                {eventItem.eventContent}
                                            </div>
                                        </div>}
                                    chipColor={eventItem.status || GCCalenderEnums.GCCalenderColor.INFO}
                                    onContextMenu={(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleDateOpenContextMenu(e, eventItem.contextMenuList, eventItem)
                                    }}
                                    onClick={(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (eventItem.onClick && props.usingMode === usingMode.EDITONLY) {
                                            eventItem.onClick(eventItem)
                                        }
                                    }}
                                />
                            })}
                        </td>
                    </TableRowOfCalendar >

                    {/* 月-時間展開 資料 */}
                    {monthTimedataCollapse.some(ele => ele.name === dataItem.dataId)
                        ? <TableBodyTimeLine
                            timeStart={props.timeStart}
                            timeEnd={props.timeEnd}
                            invalidEvent={props.invalidEvent}
                            usingMode={props.usingMode}
                            disableDateArr={props.disableDateArr}
                            disableDateSet={props.disableDateSet}
                            dateArr={dateArr}
                            data={dataItem}
                            display={monthTimedataCollapse.find(ele => ele.name === dataItem.dataId)?.value === 'Y'}
                            handleDateOpenContextMenu={handleDateOpenContextMenu}
                            dayCustomClickEvent={props.dayCustomClickEvent}
                            dayCustomContextMenuEvent={props.dayCustomContextMenuEvent}
                        /> : null}

                </React.Fragment>
            })}
        </tbody>
    </table >
}

/** 日檢視 table 內容 */
function TableDayVersion(props: GCCalenderProps & {
    currentDate: Date
    /** 右鍵點擊展開 ContextMenu */
    handleDateOpenContextMenu(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, MenuList?: ContextMenuListType[], T?: any): void
}) {
    /** 當下時間 */
    let nowTimeStr =
        ('0' + new Date().getHours()).slice(-2) +
        ('0' + new Date().getMinutes()).slice(-2)
    /** 時間選單 */
    const timeRangeArr = getCodeListTime({ timeStart: props.timeStart, timeEnd: props.timeEnd })

    return <table className="GCCalenderTable">
        {/* TableHead */}
        <TableHeadOfCalendar >
            <TableRowOfCalendar>
                <TableHeadCellOfCalendar
                    className='sticky_left '
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <MajorTitle>
                        {props.primaryTitle}
                    </MajorTitle>
                </TableHeadCellOfCalendar>
                {/* 橫向 日 thead */}
                {/* 過濾時間於 月曆起始時間 與 結束時間 之間 */}
                {timeRangeArr.slice(0, -1).map((timeItem, timeIndex) => {
                    /** 判斷是否含今日並於該時間區間  */
                    let isNow = Number(timeItem.value) < Number(nowTimeStr) &&
                        Number(timeRangeArr[timeIndex + 1]?.value) > Number(nowTimeStr) &&
                        getIsToday(props.currentDate),
                        /** 為不能操作的日期 */
                        valid = props.disableDateArr ? getIsValidDate(props.currentDate, props.disableDateArr, props.disableDateSet) : true

                    return <TableHeadCellOfCalendar
                        key={timeItem.value}
                        id={isNow ? 'GCCalender_now_Day' : ''}
                        className={(isNow ? 'GCCalenderNowTime ' : '') +
                            (valid ? '' : ' GCCalenderDisabled')
                        }
                        style={{
                            gap: '4px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            width: '100px',
                        }}
                        onContextMenu={props.usingMode === usingMode.EDITONLY
                            ? (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!valid) {
                                    props.invalidEvent()
                                } else if (props.dateContextMenuList) {
                                    props.handleDateOpenContextMenu(e, props.dateContextMenuList, new Date(
                                        DateTimeFormate.dateToString({ date: props.currentDate, mode: DateTimeFormate.DateMode.yyyyMMdd }) + ' ' + timeItem.name
                                    ))
                                }
                            }
                            : undefined}
                    >
                        <MinorTitle>
                            {props.timeMode === timeMode.FULL
                                ? null
                                : Number(timeItem.value.slice(0, 2)) >= 12 ? 'PM' : 'AM'}
                        </MinorTitle>
                        <MajorTitle>
                            {props.timeMode === timeMode.FULL
                                ? timeItem.name
                                : (Number(timeItem.value.slice(0, 2)) % 12 || 12) + ':00'}
                        </MajorTitle>

                    </TableHeadCellOfCalendar>

                })}
            </TableRowOfCalendar>
        </TableHeadOfCalendar>

        {/* TableBody */}
        <tbody>
            {props.data.map((dataItem, dataIndex) => {
                /** CHIPCARD 資料 */
                const chiCardData = dataItem.eventDataArr.filter(ele =>
                    new Date(DateTimeFormate.dateFormate({ dateStr: ele.startTime, Mode: DateTimeFormate.DateMode.yyyyMMdd })).toString() === props.currentDate.toString() &&
                    ele.eventType === eventType.CHIPCARD),
                    /** 為不能操作的日期 */
                    valid = props.disableDateArr ? getIsValidDate(props.currentDate, props.disableDateArr, props.disableDateSet) : true

                return <TableRowOfCalendar
                    key={dataItem.dataId}
                    style={{ position: 'relative' }}>
                    {/* 縱向-資料 */}
                    <TableHeadCellOfCalendar
                        className='sticky_left'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <MinorTitle>
                            {dataItem.name}
                        </MinorTitle>
                    </TableHeadCellOfCalendar>

                    {/* 月曆格子 */}
                    <td colSpan={timeRangeArr.slice(0, -1).length} style={{ padding: '0', position: 'relative' }}>
                        <table className="GCCalenderTable" style={{ margin: '-.9px' }}>
                            <tbody>
                                <tr>
                                    {/* 過濾時間於 月曆起始時間 與 結束時間 之間 */}
                                    {timeRangeArr.slice(0, -1).map((timeItem, timeIndex) => {
                                        /** 依照點擊方格取得新時間 */

                                        return (
                                            <TableTimeCellOfCalendar
                                                key={timeItem.value}
                                                className={(valid ? '' : ' GCCalenderDisabled')}
                                                style={{ width: '60px' }}
                                                direction={'vertical'}
                                                disabled={props.usingMode !== usingMode.EDITONLY || !valid}
                                                onContextMenu={props.usingMode === usingMode.EDITONLY
                                                    ? (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        const times = DateTimeFormate.dateToString({
                                                            date: props.currentDate,
                                                            mode: DateTimeFormate.DateMode.yyyyMMdd
                                                        }) + ' ' + (timeItem.value.slice(0, 2) + ':' + e.currentTarget.getAttribute('data-time'))
                                                        if (!valid) {
                                                            props.invalidEvent()
                                                        } else if (props.dayCustomContextMenuEvent) {
                                                            props.handleDateOpenContextMenu(e, props.dayCustomContextMenuEvent, new Date(times))
                                                        }
                                                    }
                                                    : undefined}
                                                onClick={props.usingMode === usingMode.EDITONLY
                                                    ? (e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        const times = DateTimeFormate.dateToString({
                                                            date: props.currentDate,
                                                            mode: DateTimeFormate.DateMode.yyyyMMdd
                                                        }) + ' ' + (timeItem.value.slice(0, 2) + ':' + e.currentTarget.getAttribute('data-time'))
                                                        if (!valid) {
                                                            props.invalidEvent()
                                                        } else if (valid && props.dayCustomClickEvent) props.dayCustomClickEvent(new Date(times), dataItem)
                                                    }
                                                    : undefined}
                                            />
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                        {chiCardData.map((dataItem) => {

                            return <HorizontalCardOfGCCalender
                                key={dataItem.eventId}
                                timeRangeArr={timeRangeArr}
                                start_time={dataItem.startTime}
                                end_time={dataItem.endTime}
                                color={dataItem.status || GCCalenderEnums.GCCalenderColor.INFO}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (dataItem.contextMenuList) {
                                        props.handleDateOpenContextMenu(e, dataItem.contextMenuList, dataItem)
                                    }
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (dataItem.onClick && props.usingMode === usingMode.EDITONLY) {
                                        dataItem.onClick(dataItem)
                                    }
                                }}
                                children={dataItem.eventContent}
                            />
                        })}

                    </td>
                </TableRowOfCalendar >

            })}

        </tbody>
    </table >
}

/** 行動裝置 table 內容 */
function TableMobileVersion(props: GCCalenderProps & {
    dateArr: Date[],
    /** 右鍵點擊展開 ContextMenu */
    handleDateOpenContextMenu(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, MenuList?: ContextMenuListType[], T?: any): void    /** 手動 資料開合 */
    /** 手動 資料開合 */
    handleTableRow(elem: GCCalenderProps['data'][number]): void,
    /** 目前月曆呈現時間起 */
    currentCalenderTimeStart: string,
    /** 目前月曆呈現時間迄 */
    currentCalenderTimeEnd: string,
    /** 目前那些資料正被展開 */
    monthTimedataCollapse: OptionListType[]

}) {
    const { dateArr, handleDateOpenContextMenu, handleTableRow, currentCalenderTimeStart, currentCalenderTimeEnd, monthTimedataCollapse } = props
    const [nowShowData, setNowSetData] = useState<{
        /** 預設開啟日 */
        date: Date,
        /** 目前查看之 資料 id*/
        dataId: string
    }>({
        date: new Date(DateTimeFormate.todayDateFormate({ Mode: DateTimeFormate.DateMode.yyyyMMdd })),
        dataId: props.data[0].dataId
    })

    /** 選擇日期 */
    function handleDateChose(selectDate: Date) {
        setNowSetData(prev => ({ ...prev, date: selectDate }))
    }

    /** 選擇 Data */
    function handleDataChose(selectDataId: string) {
        setNowSetData(prev => ({ ...prev, dataId: selectDataId }))
    }

    /* 所選資料 */
    const displayData = props.data.find(ele => (ele.dataId === nowShowData.dataId)),
        displayEvent = displayData?.eventDataArr.filter(ele => new Date(DateTimeFormate.dateFormate({
            dateStr: ele.startTime,
            Mode: DateTimeFormate.DateMode.yyyyMMdd
        })).getTime() === nowShowData.date.getTime()) || []

    useEffect(() => {
        setNowSetData({
            date: new Date(
                props.dateArr.some(ele => ele.getTime() === new Date(DateTimeFormate.todayDateFormate({ Mode: DateTimeFormate.DateMode.yyyyMMdd })).getTime())
                    ? DateTimeFormate.todayDateFormate({ Mode: DateTimeFormate.DateMode.yyyyMMdd })
                    : DateTimeFormate.dateFormate({ dateStr: props.currentCalenderTimeStart, Mode: DateTimeFormate.DateMode.yyyyMMdd })
            ),
            dataId: props.data[0].dataId
        })
    }, [props.currentCalenderTimeStart, props.data])

    // 初始時將畫面捲動至對應視窗
    useEffect(() => {
        document.getElementById('GCCalender_now_mobile')?.scrollIntoView()
    }, [])

    return <React.Fragment>
        <div className="wS_D_none GCCM_Titile GCCalenderTablePadding" style={{
            backgroundColor: '#fff'
        }}>
            <MajorTitle>
                {props.primaryTitle}
            </MajorTitle>
        </div>

        <div className="wS_D_none GCCM_data_bar GCCalenderTablePadding">
            {props.data.map((dataItem, dataIndex) => {
                return <TextButton
                    key={dataItem.dataId}
                    // color='secondary'
                    // variant={nowShowData.dataId === dataItem.dataId ? 'contained' : 'outlined'}
                    text={dataItem.name}
                    onClick={() => { handleDataChose(dataItem.dataId) }}
                />

            })}
        </div>

        {/* 橫向 日 thead */}
        <Box className='wS_D_none GCCM_date_bar GCCalenderTablePadding'
            overflow={'auto'}
            display="flex"
            flexDirection={'row'}
            alignContent={'center'}
            justifyContent='space-between'
            flexWrap={"nowrap"}
        >
            {dateArr.map((dateItem, dateIndex) => {

                return <MobileDateButton key={dateItem.getTime()}
                    id={nowShowData.date.getTime() === dateItem.getTime() ? 'GCCalender_now_mobile' : ''}
                    className={nowShowData.date.getTime() == dateItem.getTime() ? 'active' : ''}
                    onClick={() => { handleDateChose(dateItem) }}
                    style={{
                        opacity: nowShowData.date.getTime() === dateItem.getTime() ? '1' : '.5',
                    }}
                >
                    <div className="">{getWeakDay(dateItem.getDay())}</div>
                    <div className="">{dateItem.getDate()}</div>
                </MobileDateButton>
            })}
        </Box>

        {/* 月 資料 */}
        <div className=""
            style={{ width: '100%', overflow: 'hidden' }}>
            <table className="GCCalenderTable"
                style={{ overflow: 'hidden' }}>
                <tbody>
                    {displayData
                        ? <TableBodyTimeLine
                            timeStart={props.timeStart}
                            timeEnd={props.timeEnd}
                            invalidEvent={props.invalidEvent}
                            usingMode={props.usingMode}
                            disableDateArr={props.disableDateArr}
                            disableDateSet={props.disableDateSet}
                            dateArr={[nowShowData.date]}
                            data={{ ...displayData, eventDataArr: displayEvent }}
                            display
                            handleDateOpenContextMenu={handleDateOpenContextMenu}
                            dayCustomClickEvent={props.dayCustomClickEvent}
                            dayCustomContextMenuEvent={props.dayCustomContextMenuEvent}
                        /> : null}
                </tbody>
            </table>
        </div>
    </React.Fragment >
}

/** 以時間為旁軸之 子 table 內容 */
function TableBodyTimeLine(props: Readonly<{
    /** 目前模式 (編輯/查看) */
    usingMode: usingMode,
    /** 橫向資料 */
    dateArr: Date[],
    /** 是被展開 */
    display: boolean,
    /** 事件資訊 */
    data: GCCalenderDataType,
    /** 日期右鍵點擊 */
    handleDateOpenContextMenu(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, MenuList?: ContextMenuListType[], T?: any): void    /** 編輯模式月曆格子點擊事件 */
    /** 編輯模式月曆格子右鍵 選單內容 */
    dayCustomContextMenuEvent?: ContextMenuListType[]
    /** 編輯模式月曆格子點擊事件 */
    dayCustomClickEvent?: (date: Date, dataItem: GCCalenderDataType) => void
    /** 指定的不能操作的日期 */
    disableDateArr?: string[],
    /** 指定哪個日期開始不能操作 */
    disableDateSet?: { year: number | null, month: number | null; day: number | null },
    /** 月曆起始時間 */
    timeStart?: string,
    /** 月曆結束時間 */
    timeEnd?: string,
    /** 無法編輯提示 日期方格點擊 event */
    invalidEvent: () => void,
}>) {

    // 當下資料是否含今日
    const [isthisMonth, setIsThisMonth] = useState<boolean>(false)
    /** 當下時間 */
    let nowTimeStr =
        ('0' + new Date().getHours()).slice(-2) +
        ('0' + new Date().getMinutes()).slice(-2)

    useEffect(() => {
        setIsThisMonth(prev => {
            let res = false
            // 判斷傳入資料是否含今日
            for (let dateItem of props.dateArr) {
                if (getIsToday(dateItem)) { res = true }
            }
            return res
        })

    }, [props.dateArr])

    /** "sm" MUI 提供分頁斷點位置 hook */
    const isMobile = useMediaQuery((theme: Theme) => theme?.breakpoints.down('sm'));
    /** 全日事件們 */
    const singleDayEventArr = props.data.eventDataArr.filter((eventData) => eventData.eventType === eventType.SINGELDAY)
    /** 時間選單 */
    const timeRangeArr = getCodeListTime({ timeStart: props.timeStart, timeEnd: props.timeEnd })

    return <TableRowOfCalendar
        style={{
            height: 'auto'
        }}>
        <td style={{
            height: 'auto',
            padding: '0px'
        }} colSpan={props.dateArr.length + 1} >

            <Collapse in={props.display} timeout="auto" >

                <table
                    className="GCCalenderTable insetShadow"
                    style={{
                        margin: '-1.5px',
                    }}>
                    {singleDayEventArr.length
                        ? <thead>
                            <TableHeadCellOfCalendar
                                className={'sticky_left'}
                                children={'整日'}
                                style={{ width: isMobile ? '20px' : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', color: '#7f7f7f' }} />

                            {/* 全日事件顯示 (每日格子) */}
                            {props.dateArr.map((dateItem, dateIndex) => {
                                return <TableHeadCellOfCalendar
                                    key={dateItem.getTime()}
                                    style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '5px' }}
                                >
                                    {// 過濾是"當日"且eventType為"整日(SINGELDAY)"事件
                                        singleDayEventArr.filter((eventData) => new Date(DateTimeFormate.dateFormate({ dateStr: eventData.startTime, Mode: DateTimeFormate.DateMode.yyyyMMdd })).getTime() === dateItem.getTime())
                                            .map((singleDayData) => <ChipOfGCCalender
                                                chipColor={singleDayData.status || GCCalenderEnums.GCCalenderColor.INFO}
                                                style={{ width: '100%', height: '36px' }}
                                                label={singleDayData.eventContent}
                                                onContextMenu={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    if (singleDayData.contextMenuList) {
                                                        props.handleDateOpenContextMenu(e, singleDayData.contextMenuList, singleDayData)
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    if (singleDayData.onClick && props.usingMode === usingMode.EDITONLY) {
                                                        singleDayData.onClick(singleDayData)
                                                    }
                                                }}
                                                onDoubleClick={
                                                    isMobile
                                                        ? (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                                            e.preventDefault();
                                                            e.stopPropagation()
                                                            if (singleDayData.contextMenuList) {
                                                                props.handleDateOpenContextMenu(e, singleDayData.contextMenuList, singleDayData)
                                                            }
                                                        }
                                                        : undefined
                                                }
                                            />)}
                                </TableHeadCellOfCalendar>
                            })}
                        </thead>
                        : null}
                    <tbody>
                        {/* 過濾時間於 月曆起始時間 與 結束時間 之間 */}
                        {timeRangeArr.slice(0, -1).map((timeItem, timeIndex) => {
                            /** 判斷是否含今日並於該時間區間  */
                            const isNow = Number(timeItem.value) < Number(nowTimeStr) &&
                                Number(timeRangeArr[timeIndex + 1]?.value) > Number(nowTimeStr) &&
                                isthisMonth

                            return <TableRowOfCalendar
                                key={timeItem.value}
                                style={{
                                }}>

                                {/* 時間 tHead */}
                                <TableHeadCellOfCalendar
                                    className={'sticky_left ' + (isNow ? 'GCCalenderNowTime' : '')}
                                    style={{
                                        width: isMobile ? '20px' : undefined,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        color: '#7f7f7f'
                                    }}
                                >
                                    <MinorTitle children={timeItem.name} />
                                    <MinorTitle children={'|'} />
                                    <MinorTitle children={timeRangeArr[timeIndex + 1]?.name || '24:00'} />
                                </TableHeadCellOfCalendar>

                                {/* 時間格 tbody */}
                                {props.dateArr.map((dateItem) => {
                                    /** 為不能操作的日期 */
                                    let valid = true
                                    if (props.disableDateArr) {
                                        valid = getIsValidDate(dateItem, props.disableDateArr, props.disableDateSet)
                                    }
                                    if (props.timeEnd || props.timeStart) {

                                    }

                                    return <TableTimeCellOfCalendar key={dateItem.getTime() + timeItem.value}
                                        direction={'horizontal'}
                                        disabled={props.usingMode !== usingMode.EDITONLY || !valid}
                                        className={(valid ? '' : ' GCCalenderDisabled')}
                                        style={{ width: isMobile ? '100%' : undefined }}
                                        onClick={props.usingMode === usingMode.EDITONLY
                                            ? (e) => {
                                                /** 依照點擊方格取得新時間 */
                                                const times = DateTimeFormate.dateToString({
                                                    date: dateItem,
                                                    mode: DateTimeFormate.DateMode.yyyyMMdd
                                                }) + ' ' + (timeItem.value.slice(0, 2) + ':' + e.currentTarget.getAttribute('data-time'))
                                                if (props.dayCustomClickEvent) {
                                                    if (!valid) {
                                                        props.invalidEvent()
                                                    } else { props.dayCustomClickEvent(new Date(times), props.data) }
                                                }
                                            }
                                            : undefined
                                        }
                                        onContextMenu={props.usingMode === usingMode.EDITONLY
                                            ? (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                                e.preventDefault()
                                                const times = DateTimeFormate.dateToString({
                                                    date: dateItem,
                                                    mode: DateTimeFormate.DateMode.yyyyMMdd
                                                }) + ' ' + (timeItem.value.slice(0, 2) + ':' + e.currentTarget.getAttribute('data-time'))
                                                if (!valid) {
                                                    props.invalidEvent()
                                                } else if (props.dayCustomContextMenuEvent) {
                                                    props.handleDateOpenContextMenu(e, props.dayCustomContextMenuEvent, new Date(times))
                                                }
                                            }
                                            : undefined}
                                    />
                                }
                                )}
                            </TableRowOfCalendar>

                        })}

                        <tr>
                            {props.data.eventDataArr.filter(ele => ele.eventType === eventType.CHIPCARD)
                                // 先將資料排序好 (避免) 重疊醜醜的狀況
                                .sort((a, b) => Number(a.startTime) - Number(b.startTime))
                                .map((dataItem) =>
                                    <td key={dataItem.eventId} >
                                        <VerticalCardOfGCCalender
                                            dateArr={props.dateArr}
                                            timeRangeArr={timeRangeArr}
                                            start_time={dataItem.startTime}
                                            end_time={dataItem.endTime}
                                            leftShift={isMobile ? 35 : widthDisPlaceUnit}
                                            color={dataItem.status || GCCalenderEnums.GCCalenderColor.INFO}
                                            onContextMenu={(e) => {
                                                e.preventDefault()
                                                if (dataItem.contextMenuList) {
                                                    props.handleDateOpenContextMenu(e, dataItem.contextMenuList, dataItem)
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (dataItem.onClick && props.usingMode === usingMode.EDITONLY) {
                                                    dataItem.onClick(dataItem)
                                                }
                                            }}
                                            children={dataItem.eventContent}
                                            isMobile={isMobile}
                                        />
                                    </td>
                                )}
                        </tr>
                    </tbody>
                </table>
            </Collapse>
        </td>
    </TableRowOfCalendar>

}
// #endregion

// #region table component

type CommonComponentProps = {
    /** 子元件 */
    children?: React.ReactNode,
    /** CSS style */
    style?: React.CSSProperties,
    colSpan?: number,
    rowSpan?: number,
    [key: string]: any
}
type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

/** tHead Of Calender */
const TableHeadOfCalendar: React.FC<CommonComponentProps> = ({ children, style }) => {
    return <thead
        className="sticky_top"
        style={{
            ...style,
            zIndex: style?.zIndex || '5'
        }}
    >
        {children || null}
    </thead>
};

/** tr Of Calender */
const TableRowOfCalendar: React.FC<CommonComponentProps & DivProps> = ({ children, style, ...props }) => {
    return <tr className={'TableRowOfGCCalendar' + (props.className || '')}
        style={{
            ...style,
        }}>
        {children}
    </tr>
};

/** th in Calender */
const TableHeadCellOfCalendar: React.FC<CommonComponentProps & DivProps> = ({ children, style, ...props }) => {
    return <th
        id={props.id}
        className={'GCCalenderTh ' + (props.className || '')}
        scope={'col'}
        style={{
            cursor: 'onClick' in props ? 'pointer' : undefined,
        }}
        onClick={(e) => { e.preventDefault(); if (props.onClick) props.onClick(e) }}
        onContextMenu={(e) => { e.preventDefault(); if (props.onContextMenu) props.onContextMenu(e) }}
        colSpan={props.colSpan}
        rowSpan={props.rowSpan}
    >
        <div className='h-100'
            style={{
                ...style,
                width: style?.width || '215px',
            }}
        >
            {children}
        </div>
    </th >
};

/** td in Calender */
const TableCellOfCalendar: React.FC<CommonComponentProps & DivProps> = ({ children, style, ...props }) => {
    /** "sm" MUI 提供分頁斷點位置 hook */
    const isMobile = useMediaQuery((theme: Theme) => theme?.breakpoints.down('sm'));

    return <td className={'GCCalenderTd h-60 GCCalenderTablePadding bg-white ' + (props.className || '')}
        style={{
            backgroundColor: style?.backgroundColor,
            border: `1px solid #0000001F`,
            cursor: props.onClick ? 'pointer' : undefined,
        }}
        onClick={(e) => { e.preventDefault(); if (props.onClick) props.onClick(e) }}
        onContextMenu={isMobile
            ? undefined
            : (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
        }
        onDoubleClick={isMobile
            ? (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
            : undefined
        }
        colSpan={props.colSpan}
        rowSpan={props.rowSpan}
    >
        <div className={"h-100 d-flex justifyContent-start alignItems-center"}
            style={{
                ...style,
                width: '215px',
            }}

        >
            {children}
        </div>
    </td>
};

/** td in time Calender */
const TableTimeCellOfCalendar: React.FC<CommonComponentProps & DivProps & {
    /** flex 方向  horizontal水平 vertical垂直*/
    direction: 'horizontal' | 'vertical'
}> = ({ children, style, ...props }) => {
    /** "sm" MUI 提供分頁斷點位置 hook */
    const isMobile = useMediaQuery((theme: Theme) => theme?.breakpoints.down('sm'));

    return <td className={'GCCalenderTd h-60 bg-white ' + props.className}
        style={{
            ...style,
            border: `1px solid #0000001F`,
        }}
    >
        <div className={"GCCalenderTdTime " + props.direction}>
            <div data-time="00"
                style={{
                    cursor: !props.disabled && props.onClick ? 'pointer' : 'default',
                    width: isMobile ? '89.47vw' : undefined
                }}
                onClick={(e) => { e.preventDefault(); if (props.onClick) props.onClick(e) }}
                onContextMenu={isMobile
                    ? undefined
                    : (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
                }
                onDoubleClick={
                    isMobile
                        ? (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
                        : undefined
                }
            >
            </div>

            <div data-time="30"
                style={{
                    cursor: !props.disabled && props.onClick ? 'pointer' : 'default',
                    width: isMobile ? '89.47vw' : undefined
                }}
                onContextMenu={isMobile
                    ? undefined
                    : (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
                }
                onDoubleClick={
                    isMobile
                        ? (e) => { e.preventDefault(); if (props.onContextMenu && !props.disabled) props.onContextMenu(e) }
                        : undefined
                } >
            </div>
        </div>
    </td>
};


// #endregion

// #region component
/** 大字 */
const MajorTitle: React.FC<CommonComponentProps> = ({ children, style, ...props }) => {
    return <div style={{
        ...style,
        fontSize: '20px',
        fontWeight: '700',
        lineHeight: '24.2px',
    }}>{children}</div>
};

/** 小字 */
const MinorTitle: React.FC<CommonComponentProps> = ({ children, style, ...props }) => {
    return <div style={{
        ...style,
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '14.52px'
    }}>{children}</div>
};

/** 一般功能鍵 */
const CommonFcnButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    height: "30px",
    width: "30px",
    minWidth: '0px',
    padding: "5px",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "6px",
    borderColor: '#0000001F',
    "&:hover": {
        backgroundColor: "#f5f5f5"
    },
    "&.active": {
        backgroundColor: "#7F92CC",
        color: '#FFFFFF',
    },
    "&.active:hover": {
        backgroundColor: "#aab9e6 ",
    },
}));

/** 手機版日期按鈕 */
const MobileDateButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    width: "14%",
    aspectRatio: '1/1',
    padding: "5px",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "100%",
    borderColor: '#0000001F',
    display: "inline-block",
    "&:hover": {
        backgroundColor: "#f5f5f5"
    },
    "&.active": {
        backgroundColor: "#7F92CC",
        color: '#FFFFFF',
    },
    "&.active:hover": {
        backgroundColor: "#aab9e6 ",
    },
}));


/** 日期選擇器 
 * @param type 
*/
const DatePickerButton: React.FC<CommonComponentProps & {
    name: string,
    id: string,
    value: string,
    type: DatePickerProps<"">['type'],
    onChange: Function
}> = ({ children, style, ...props }) => {
    // 追蹤日期選擇對話框的打開狀態
    const [open, setOpen] = useState(false);
    return <>
        <LocalizationProvider locale={zhTW} dateAdapter={AdapterDayjs}>
            <Button
                style={{
                    color: '#7F92CC',
                }}
                children={
                    DateTimeFormate.dateFormate({
                        dateStr: props.value,
                        Mode: DateTimeFormate.DateMode.yyyy,
                    })
                    + '年' +
                    DateTimeFormate.dateFormate({
                        dateStr: props.value,
                        Mode: DateTimeFormate.DateMode.MMdd,
                        joinDate: '月',
                    }).split('月')[0]
                    + '月' +
                    (props.type === 'date'
                        ? DateTimeFormate.dateFormate({
                            dateStr: props.value,
                            Mode: DateTimeFormate.DateMode.MMdd,
                            joinDate: '月',
                        }).split('月')[1] + '日'
                        : '')

                }
                onClick={(ev: MouseEvent) => {
                    setOpen(prev => !prev)
                }}
            />
            <DatePicker
                {...props}
                views={props.type === 'month' ? ['year', 'month'] : ['year', 'month', 'date']} // 指定只顯示年和月
                margin="normal"
                id="date-picker-dialog"
                className="d-none"
                format="yyyy/MM"
                open={open}
                onClose={() => setOpen(false)} // 設置關閉時的處理函數
                value={DateTimeFormate.dateFormate({ dateStr: props.value, Mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: '-' })}
                onChange={() => {
                    if (props.onChange) {
                        props.onChange(
                            { "target": { "name": props.name, "value": "e", "type": "date", } }
                        )
                    }
                }}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </LocalizationProvider>
    </>
};

/** 直向事件 Card */
const VerticalCardType = styled(Card)(({ cardcolor, }: { cardcolor: GCCalenderColor, }) => ({
    borderRadius: '4px',
    width: '215px',
    minHeight: heightEventUnit + 'px',
    margin: '0 10px 0 12px',
    position: 'absolute',
    whiteSpace: 'normal',
    overflow: 'hidden',
    border: '1px solid #ffffffab',
    boxShadow: 'none',
    backgroundColor: cardcolor,
    "&:hover": {
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    },
}));

/** 直向事件卡片 */
const VerticalCardOfGCCalender: React.FC<CommonComponentProps & CardProps & {
    /** 資料 */
    dateArr: Date[],
    /** 起始時間 */
    start_time: string,
    /** 結束時間 */
    end_time?: string,
    /** 卡片顏色 */
    color: GCCalenderColor,
    /** 左手邊Th寬度 */
    leftShift: number,
    /** 是否為手機板 */
    isMobile?: boolean,
    /** 時間選單 */
    timeRangeArr: {
        name: string;
        value: string;
    }[]
}> = ({ children, style, ...props }) => {

    /** 計算持續時間區間長度 
     * @param start_time 開始時間
     * @param end_time 結束時間
    */
    function getTimeRange(start_time: string, end_time?: string) {
        // 若有給事件結束時間, 則自動計算
        if (end_time) {
            const startDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: start_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
                endDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: end_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm }))
            // 計算時間差，結果單位為毫秒
            // 將毫秒轉換為分鐘
            return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        }
        // 若無事件結束時間, 則為30分鐘
        else {
            return 30
        }
    }

    /** 計算開始時間 - 垂直位移
     * @param start_time 開始時間 
    */
    function getVerticalShift(start_time: string,) {
        const startDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: DateTimeFormate.dateRegex(start_time).substring(0, 8) + props.timeRangeArr[0].value + '00', Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
            endDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: start_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm, joinDateTime: ' ' }))
        // 計算時間差，結果單位為毫秒
        // 將毫秒轉換為分鐘
        return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 30);
    }

    /** 計算日期 - 水平位移 
     * @param start_time 開始時間 
    */
    function getHorizontalShift(start_time: string,) {
        const startDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: start_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm }))
        // 計算時間差，結果單位為毫秒
        // 將毫秒轉換為分鐘
        return Math.floor((startDateTime.getTime() - props.dateArr[0]?.getTime()) / (1000 * 60 * 60 * 24));
    }

    return <VerticalCardType
        onContextMenu={props.isMobile
            ? undefined
            : (e) => {
                e.preventDefault()
                e.stopPropagation()
                if (props.onContextMenu) props.onContextMenu(e)
            }}
        onDoubleClick={props.isMobile
            ? (e) => {
                e.preventDefault()
                if (props.onContextMenu) props.onContextMenu(e)
            }
            : undefined}
        onClick={(e) => {
            e.preventDefault()
            if (props.onClick) props.onClick(e)
        }}
        className={'VerticalCardOfGCCalender ' + (props.className || '')}
        cardcolor={props.color}
        style={{
            ...style,
            cursor: props.onClick ? 'pointer' : undefined,
            margin: style?.margin || undefined,
            top: heightDisPlaceUnit * getVerticalShift(props.start_time) + 'px',
            left: props.leftShift + (widthDisPlaceUnit * getHorizontalShift(props.start_time)) + 'px',
            height: heightEventUnit * getTimeRange(props.start_time, props.end_time),
            width: props.isMobile ? '90%' : undefined,
        }}
    >
        <CardContent style={{ padding: '8px' }}>
            {children}
        </CardContent>
    </VerticalCardType>

};

/** 橫向事件卡片 */
const HorizontalCardOfGCCalender: React.FC<CommonComponentProps & CardProps & {
    /** 起始時間 */
    start_time: string,
    /** 結束時間 */
    end_time?: string,
    /** 卡片顏色 */
    color: GCCalenderColor,
    /** 時間選單 */
    timeRangeArr: {
        name: string;
        value: string;
    }[]
}> = ({ children, style, ...props }) => {

    /** 計算持續時間區間長度 
     * @param start_time 開始時間
     * @param end_time 結束時間
    */
    function getTimeRange(start_time: string, end_time?: string) {
        // 若有給事件結束時間, 則自動計算
        if (end_time) {
            const startDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: start_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
                endDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: end_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm }))
            // 計算時間差，結果單位為毫秒
            // 將毫秒轉換為分鐘
            return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        }
        // 若無事件結束時間, 則為30分鐘
        else {
            return 30
        }
    }

    /** 計算開始時間 - 水平位移
     * @param start_time 開始時間 
    */
    function getHorizontalShift(start_time: string) {
        const startDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: DateTimeFormate.dateRegex(start_time).substring(0, 8) + props.timeRangeArr[0].value + '00', Mode: DateTimeFormate.DateMode.yyyyMMddhhmm })),
            endDateTime = new Date(DateTimeFormate.dateFormate({ dateStr: start_time, Mode: DateTimeFormate.DateMode.yyyyMMddhhmm }))
        // 計算時間差，結果單位為毫秒
        // 將毫秒轉換為分鐘
        return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    }

    return <ChipOfGCCalender
        style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            // 由於以日檢視格的寬度為123px , 所以才有這個奇怪的比例
            left: 2.043 * getHorizontalShift(props.start_time) + 'px',
            width: 2.043 * getTimeRange(props.start_time, props.end_time) + 'px',
            height: 'fit-content',
            maxHeight: '36px'
        }}
        size={'small'}
        label={
            <div style={{ width: '100%', position: 'relative' }}>
                <div style={{
                    position: 'sticky',
                    left: widthDisPlaceUnit + 10,
                    display: 'inline-block'
                }}>
                    {children}
                </div>
            </div>}
        chipColor={props.color}
        onContextMenu={(e) => {
            e.preventDefault()
            if (props.onContextMenu) props.onContextMenu(e)
        }}
        onClick={(e) => {
            e.preventDefault()
            if (props.onClick) props.onClick(e)
        }}
    />
};

/** 事件 chip */
const ChipOfGCCalender: React.FC<CommonComponentProps & {
    /** 卡片顏色 */
    chipColor: GCCalenderColor,
    label: React.ReactNode,
    onContextMenu: (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
    onClick: (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
}> = ({ children, style, chipColor, label, ...props }) => {
    return <div
        className="GCC_Chip"
        {...props}
        style={{
            ...style,
            backgroundColor: chipColor,
        }}>
        <div className="d-flex alignItems-center justifyContent-center">
            {label}
        </div>
    </div>
};

/** 右鍵 contextMenu */
const ContextMenuOfGCCalender: React.FC<{
    style?: React.CSSProperties | undefined,
    positionX?: number | undefined,
    positionY?: number | undefined,
    contextMenuList: ContextMenuListType[],
    /** 關閉 ContextMenu */
    handleCloseContextMenu(): void

}> = (props) => {
    const [x, setX] = useState<number | undefined>(props.positionX || undefined)
    const [y, setY] = useState<number | undefined>(props.positionY || undefined)

    useEffect(() => {
        let viewportWidth = document.querySelector("main")?.offsetWidth,
            viewportHeight = document.querySelector("main")?.offsetHeight;
        let newX = viewportWidth
            ? viewportWidth < (Number(props.positionX) + 240)
                ? (Number(props.positionX) - 240)
                : props.positionX
            : props.positionX;
        let newY = viewportHeight
            ? viewportHeight < (Number(props.positionY) + (33.5 * props.contextMenuList.length))
                ? (Number(props.positionY) - (33.5 * props.contextMenuList.length))
                : props.positionY
            : props.positionY;

        setX(newX || 0)
        setY(newY || 0)
        console.log("newX", newX);
        console.log("newY", newY);
        console.log("positionX", props.positionX);
        console.log("positionY", props.positionY);

    }, [props])
    return <List className="GCC_L" dense={true} style={{
        ...props.style,
        top: y,
        left: x,
    }}>
        {props.contextMenuList.map((listItem, listIdex) => {
            return <ListItem key={listIdex}
                className={"GCC_L_li" + (listItem.onClick ? "" : " disabled")}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    if (listItem.onClick) { listItem.onClick(); props.handleCloseContextMenu() };
                }}
                style={{ ...listItem.style }}>
                <div className="GCC_L_Icon">
                    {listItem.icon}
                </div>
                <div className="GCC_L_Content">
                    {listItem.content()}
                </div>
            </ListItem>
        })}
    </List>
}

// #endregion

/** 時間選單 
 * @param timeStart 起始時間 ex:'0600'
 * @param timeEnd 結束時間 ex:'2300'
 * @param type 指定'halfHour' 則產生每半小時為一單位選單
*/
export const getCodeListTime = ({ timeStart = '0600', timeEnd = '2300', type = 'hour' }: { timeStart?: string, timeEnd?: string, type?: 'hour' | 'halfHour' }) => {
    const start = parseInt(timeStart || '0600', 10);
    const end = parseInt(timeEnd || '2300', 10);
    const timeRangeArr: { name: string, value: string, }[] = [];
    // 如果是 'hour' 類型且起始時間不是整點，添加前一個整點
    if (type === 'hour' && start % 100 !== 0) {
        const prevHour = Math.floor(start / 100);
        timeRangeArr.push({ name: `${prevHour}:00`, value: `${prevHour}00`.padStart(4, '0') });
    }

    for (let time = start; time <= end; time += (time % 100 === 30 ? 70 : 30)) {
        const hours = Math.floor(time / 100);
        const minutes = time % 100;
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;
        timeRangeArr.push({
            name: timeString,
            value: timeString.replace(':', '').padStart(4, '0')
        });
    }

    return type === 'hour' ? timeRangeArr.filter(ele => ele.value.endsWith('00')) : timeRangeArr;
}