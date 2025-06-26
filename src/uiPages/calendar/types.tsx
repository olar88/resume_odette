/**
 * 事件
 */
export type HandleEvent = {
    target: {
        id: string
        name: string,
        value: any,
        type: string,
        key?: string
        checked?: boolean,
        files?: File[]
    }
} & Event

/**
 * OptionList 裡面常出現的選單的類型
 */
export type OptionListType<K extends string = "value", T = string> = {
    name: string;
} & { [key in K]?: T };

export const DateTimeFormate = (() => {

    /**
     * 格式
     * yyyy | yyyyMM | yyyyMMdd | yyyyMMddhhmm | yyyyMMddhhmmss | MMddhhmm | MMdd | hhmm | hhmmss
     */
    enum DateMode {
        yyyy = "yyyy",
        yyyyMM = "yyyyMM",
        yyyyMMdd = "yyyyMMdd",
        yyyyMMddhhmm = "yyyyMMddhhmm",
        yyyyMMddhhmmss = "yyyyMMddhhmmss",
        MMddhhmm = "MMddhhmm",
        MMdd = "MMdd",
        hhmm = "hhmm",
        hhmmss = "hhmmss",
    }

    // 時間處理
    let TimeFormate = (() => {
        let _minToHour = (mins: number) => (mins / 60).toFixed(1);
        let _formate = (time: string) => time.substring(0, 2) + ":" + time.substring(2, 4);
        let _formateNum = (time: string) => time.substring(0, 2) + time.substring(2, 4);
        // a.replace(/[0-9]{2}\:[0-9]{2}/gm,"");
        /**
         * 是否為合理的時間區間
         * @param {string} start 起始時間
         * @param {string} end 結束時間
         * @param {string} across_night 是否跨夜 
         */
        let _reasonableTime = (start = "", end = "", across_night = "N") => {
            let s = parseInt(start), e = parseInt(end), a = across_night.toUpperCase();
            if (s > e && a === "Y") return true;
            else if (s < e && a === "Y") return true;
            else if (s > e && a === "N") return false;
            else if (s < e && a === "N") return true;
        };
        return { _minToHour, _formate, _formateNum, _reasonableTime };
    })()

    // 拿到今天日期 yyyy-mm-dd
    let todayDateFormate = function ({ Mode = "yyyyMMdd", joinDate = "-", joinTime = ":", joinDateTime = " " }) {
        let toTwoDigit = (num: string) => ("00" + num).slice(-2);
        let d: Date = new Date(), str = "";
        let y = d.getFullYear().toString(),
            M = toTwoDigit((d.getMonth() + 1).toString()),
            date = toTwoDigit(d.getDate().toString()),
            H = toTwoDigit(d.getHours().toString()),
            m = toTwoDigit(d.getMinutes().toString()),
            s = toTwoDigit(d.getSeconds().toString());

        switch (Mode) {
            case "yyyyMMddhhmmss":
                str = y + joinDate + M + joinDate + date + joinDateTime + H + joinTime + m + joinTime + s;
                break;
            case "yyyyMMddhhmm":
                str = y + joinDate + M + joinDate + date + joinDateTime + H + joinTime + m;
                break;
            case "yyyyMMdd":
                str = y + joinDate + M + joinDate + date;
                break;
            case "yyyy":
                str = y;
                break;
            case "yyyyMM":
                str = y + joinDate + M;
                break;
            case "MMdd":
                str = M + joinDate + date;
                break;
            case "hhmm":
                str = H + joinTime + m;
                break;
            case "hhmmss":
                str = H + joinTime + m + joinTime + s;
                break;
            case "number":
                str = y + M + date;
                break;
            default:
                str = y + joinDate + M + joinDate + date + " " + H + joinTime + m;
                break;
        }
        return str;
    }
    // 轉日期 yyyy/mm/dd
    let dateToString = function (obj: {
        date: Date, mode: DateMode, joinDate?: string, joinTime?: string, joinDateTime?: string
    }): string {
        let { date, mode = "yyyyMMdd", joinDate = "/", joinTime = ":", joinDateTime = " " } = { ...obj };
        let str = "";
        // 保證 date 是 有效 Date
        if (date instanceof Date && !isNaN(date.getTime())) {
            let year = date.getFullYear().toString(),
                month = ("00" + (date.getMonth() + 1)).slice(-2),
                day = ("00" + date.getDate()).slice(-2),
                hour = ("00" + date.getHours()).slice(-2),
                min = ("00" + date.getMinutes()).slice(-2),
                sec = ("00" + date.getSeconds()).slice(-2);

            switch (mode) {
                case "yyyy":
                    str = year;
                    break;
                case "yyyyMM":
                    str = year + joinDate + month;
                    break;
                case "yyyyMMdd":
                    str = year + joinDate + month + joinDate + day;
                    break;
                case "yyyyMM":
                    str = year + joinDate + month;
                    break;
                case "yyyyMMddhhmm":
                    str = year + joinDate + month + joinDate + day + joinDateTime + hour + joinTime + min;
                    break;
                case "yyyyMMddhhmmss":
                    str = year + joinDate + month + joinDate + day + joinDateTime + hour + joinTime + min + joinTime + sec;
                    break;
                case "MMdd":
                    str = month + joinDate + day;
                    break;
                case "hhmm":
                    str = hour === "" && min === "" ?
                        "" :
                        hour + joinTime + min;
                    break;
                case "hhmmss":
                    str = hour === "" && min === "" && sec === "" ?
                        "" :
                        hour + joinTime + min + joinTime + sec;
                    break;
                default:
                    str = year + joinDate + month + joinDate + day;
                    break;
            }
        } else {
            console.error('Invalid Date')
        }
        return str;
    }

    /** 因應真正日期(不同年份的是否有229) 確認日期是否存在
     * @param {string} dateStr 日期字串 YYYY/MM/DD
     * @ return {boolean} 布林值 :是否存在
     * @ EX: isExistDate('2023/02/29'); false
     * @ EX: isExistDate('2024/02/29'); true
     */
    let isExistDate = function (dateStr: string) {
        const
            /** 使用 Date 物件建立日期*/
            actuallyDate = new Date(dateStr),
            // 字串的年月份
            year = parseInt(dateStr.split('/')[0]),
            month = parseInt(dateStr.split('/')[1]),
            day = parseInt(dateStr.split('/')[2])
        // 檢查日期是否正確
        return actuallyDate.getFullYear() === year && actuallyDate.getMonth() === month - 1 && actuallyDate.getDate() === day;
    }

    /**
     * @description 本月第一天
     * @param {*}
     * @returns 
     */
    let getMonthStart = function (date: Date | null = null) {
        let d = date === null ? new Date() : date;
        let start = new Date(d.getFullYear(), d.getMonth(), 1);
        return new Date(start);
    }

    /**
     * @description 本月最後一天
     * @param {*}
     * @returns 
     */
    let getMonthEnd = function (date: Date | null = null) {
        let d = date === null ? new Date() : date;
        let end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        return new Date(end);
    }

    /** 推算六個月前，該月份第一天 */
    let getSixMonthsAgoStartDate = function (date: Date | null = null) {
        let d = date === null ? new Date() : date;
        // 往前推六個月
        d.setMonth(d.getMonth() - 5);
        // 推算後該月份的第一天
        let start = new Date(d.getFullYear(), d.getMonth(), 1);
        return start;
    }


    /**
     *
     * @description 20181110162804 -> 2018-11-10 16:28:04
     * @param {string} dateStr 日期字串, ex: 20181110162804
     * @param {string} Mode 顯示模式, ex: yyyyMMddhhmmss
     * @param {string} Length 日期長度 < 4 | 6 | 8 | 12 | 14 >
     * @param {string} joinDate 日期之間穿插的符號
     * @param {string} joinTime 時間之間穿插的符號
     * @param {string} joinDateTime 日期跟時間之間穿插的符號
     */
    let dateFormate = function (obj: {
        dateStr: string, Mode?: DateMode, Length?: string, joinDate?: string, joinTime?: string, joinDateTime?: string,
    }): string {
        let { dateStr = "", Mode = null, Length = null, joinDate = "-", joinTime = ":", joinDateTime = " " } = { ...obj };
        let mode = null, num = null;
        if (dateStr == "") return "";
        //預先將 dateStr 去除符號
        dateStr = dateRegex(dateStr)

        if (Mode == null && Length == null) num = dateStr.length;
        else if (Mode != null) mode = Mode;
        else if (Length != null) num = Length;
        if (num != null) {
            if (num === 14) return `${dateStr.substr(0, 4)}${joinDate}${dateStr.substr(4, 2)}${joinDate}${dateStr.substr(6, 2)} ${dateStr.substr(8, 2)}${joinTime}${dateStr.substr(10, 2)}${joinTime}${dateStr.substr(12, 2)}`;
            else if (num === 12) return `${dateStr.substr(0, 4)}${joinDate}${dateStr.substr(4, 2)}${joinDate}${dateStr.substr(6, 2)} ${dateStr.substr(8, 2)}${joinTime}${dateStr.substr(10, 2)}`;
            else if (num === 8) return `${dateStr.substr(0, 4)}${joinDate}${dateStr.substr(4, 2)}${joinDate}${dateStr.substr(6, 2)}`;
            else if (num === 6) return `${dateStr.substr(0, 4)}${joinDate}${dateStr.substr(4, 2)}`;
            else if (num === 4) return `${dateStr.substr(0, 2)}${joinTime}${dateStr.substr(2, 2)}`;
            else return `${dateStr.substr(0, 4)}${joinDate}${dateStr.substr(4, 2)}${joinDate}${dateStr.substr(6, 2)} ${dateStr.substr(8, 2)}${joinTime}${dateStr.substr(10, 2)}${joinTime}${dateStr.substr(12, 2)}`;
        } else if (mode != null) {
            dateStr = dateStr.replace(/\-\:\./gm, "");
            let str = "";
            let year = dateStr.substring(0, 4);
            let month = dateStr.substring(4, 6);
            let day = dateStr.substring(6, 8);
            let hr = dateStr.substring(8, 10);
            let m = dateStr.substring(10, 12);
            let sec = dateStr.substring(12, 14);

            switch (String(Mode)) {
                case DateMode.yyyyMMddhhmmss:
                    str = `${year}${joinDate}${month}${joinDate}${day}${joinDateTime}${hr}${joinTime}${m}${joinTime}${sec}`;
                    break;
                case DateMode.yyyyMMddhhmm:
                    str = `${year}${joinDate}${month}${joinDate}${day}${joinDateTime}${hr}${joinTime}${m}`;
                    break;
                case DateMode.yyyyMMdd:
                    str = `${year}${joinDate}${month}${joinDate}${day}`;
                    break;
                case DateMode.yyyyMM:
                    str = `${year}${joinDate}${month}`;
                    break;
                case DateMode.yyyy:
                    str = year;
                    break;
                case DateMode.MMddhhmm:
                    str = `${month}${joinDate}${day}${joinDateTime}${hr}:${m}`;
                    break;
                case DateMode.MMdd:
                    str = `${month}${joinDate}${day}`;
                    break;
                case DateMode.hhmmss:
                    str = `${hr}${joinTime}${m}${joinTime}${sec}`;
                    break;
                case DateMode.hhmm:
                    str = `${hr}${joinTime}${m}`;
                    break;
            }
            if (str === joinTime || str === joinDate) return "";
            else return str;
        } else {
            return "";
        }
    }

    /**
     * 日期格式轉換
     * @param {string} Time 時間參數 (Ex:20190505...)
     * @param {string} Mode 模式 yyyyMMddhhmmss
     */
    let DateFormatSendBack = function (Time = "", Mode: string = "") {
        let EditTime = '';
        let year = Time.substring(0, 4);
        let month = Time.substring(4, 6);
        let day = Time.substring(6, 8);
        let hr = Time.substring(8, 10);
        let m = Time.substring(10, 12);
        let sec = Time.substring(12, 14);
        switch (String(Mode)) {
            case "yyyyMMddhhmmss":
                EditTime = `${year}/${month}/${day} ${hr}:${m}:${sec}`;
                break;
            case "yyyyMMddhhmm":
                EditTime = `${year}/${month}/${day} ${hr}:${m}`;
                break;
            case "yyyyMMdd":
                EditTime = `${year}/${month}/${day}`;
                break;
            case "yyyyMM":
                EditTime = `${year}/${month}`;
                break;
            case "MMddhhmm":
                EditTime = `${month}/${day} ${hr}:${m}`;
                break;
            case "MMdd":
                EditTime = `${month}/${day}`;
                break;
            case "hhmmss":
                EditTime = `${hr}:${m}:${sec}`;
                break;
            case "hhmm":
                EditTime = `${hr}:${m}`;
                break;
        }
        return EditTime;
    }

    /**
     * @description 2018-11-10 -> y=2018,m=11,d=10,date=2018-11-10
     * @param {*} dateText 
     * @returns { y: 年, m: 月, d: 日, h: 時, mm: 分, s: 秒, date: ""}
     */
    let dateFormatObj = function (dateText: string): { y: string, m: string, d: string, h: string | null, mm: string | null, s: string | null, date: string } {
        return {
            y: dateText.substring(0, 4),
            m: dateText.substring(4, 6),
            d: dateText.substring(6, 8),
            h: dateText.length >= 10 ? dateText.substring(8, 10) : null,
            mm: dateText.length >= 10 ? dateText.substring(10, 12) : null,
            s: dateText.length >= 10 ? dateText.substring(12, 14) : null,
            date: dateText
        };
    }

    /**
       * 日期去掉 - / \ : .
       * @param {string} date 日期 ex.2019.10.11
       * @param {string} replaceTo 要取代成什麼樣子，預設取代成 ""
       */
    let dateRegex = function (date: string, replaceTo = "") {
        let dateReg = /[\s\-\/\\\:\T]/gm;
        return String(date).replace(dateReg, replaceTo);
    }

    let dateTimeRegex = function (date: string, replaceTo = "") {
        let dateTimeReg = /[\-a-zA-Z\s\:]/gm;
        return String(date).replace(dateTimeReg, replaceTo);
    }

    /**
     * 取得今天的前後N天的日期
     * @param {number} Count: 天數、月數、年數 (Ex:昨天給 -1;明天給 1)
     * @param {string} dateStr: 日期 (Ex:20220928、202209、2022)
     * dateStr給空就會抓今天的日期，給空才要給 Mode < yyyyMMdd | yyyyMM | yyyy > 
     * dateStr給空，Count就會是天數
     */
    let getNextOrLastDate = function (obj: { Count: number, dateStr: string, Mode: string }) {
        let { Count = 0, dateStr = "", Mode = "" } = obj;
        let num = dateStr.length
        let year = dateStr.substring(0, 4);
        let month = dateStr.substring(4, 6);
        let day = dateStr.substring(6, 8);
        let dd: Date = new Date();
        let ddStr = "";
        if (num === 4) {
            dd = new Date(year)
        } else if (num === 6) {
            let yearInt = parseInt(year);
            let monthInt = parseInt(month);
            if ((monthInt + Count) > 12) { //明年
                dd = new Date(yearInt + 1, (((monthInt + Count) - 12) - 1))
                dd.setDate(dd.getMonth())
            } else if ((monthInt + Count) < 0) { //前年
                dd = new Date(yearInt - 1, (((12 + Count) + monthInt) - 1))
                dd.setDate(dd.getMonth())
            } else { //今年
                dd = new Date(yearInt, (monthInt - 1))
                dd.setMonth(dd.getMonth() + Count)
            }
        } else if (num === 8) {
            let yearInt = parseInt(year);
            let monthInt = parseInt(month);
            dd = new Date(yearInt, (monthInt - 1), parseInt(day))
            dd.setDate(dd.getDate() + Count)
        } else {
            dd.setDate(dd.getDate() + Count)
        }

        let y = num === 4 ? dd.getFullYear() + Count : dd.getFullYear();
        let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1)
        let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()

        if (num === 4) {
            ddStr = y.toString()
        } else if (num === 6) {
            ddStr = y.toString() + m.toString()
        } else if (num === 8) {
            ddStr = y.toString() + m.toString() + d.toString()
        } else {
            switch (String(Mode)) {
                case "yyyyMMdd":
                    ddStr = y.toString() + m.toString() + d.toString()
                    break
                case "yyyyMM":
                    ddStr = y.toString() + m.toString()
                    break
                case "yyyy":
                    ddStr = y.toString()
                    break
            }
        }
        return ddStr
    }

    let getDayName = (day: number): string => {
        let d = day.toString();
        let week: { [key: string]: string } = { "0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六" };
        return week[d];
    }

    let addDays = (date: string, days: number): Date => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * 
     * @param selectedDate 20230529
     * @returns 
     */
    let isDateBeforeToday = function (selectedDate: string): boolean {
        let date = dateFormate({ dateStr: selectedDate })
        // 取得今天的日期（只保留日期，時間設置為午夜）
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        // 將所選日期轉換為Date物件（只保留日期，時間設置為午夜）
        var selected = new Date(date);
        selected.setHours(0, 0, 0, 0);

        // 比較兩個日期的毫秒數
        if (selected < today) {
            return true; // 所選日期早於今天
        } else {
            return false; // 所選日期晚於或等於今天
        }
    }


    /**
     * 取得哪個日期開始不能操作
     * @param {numner} year 年
     * @param {numner} month 月
     * @param {numner} day 日
     * @returns 
     */
    const getDisableDate = (year = 0, month = 0, day = 0) => {
        const currentDate = new Date();


        // 計算完整的年份和月份
        const totalMonths = month;
        const years = Math.floor(Math.abs(totalMonths) / 12);
        const months = Math.abs(totalMonths) % 12;

        // 設置年份
        currentDate.setFullYear(
            totalMonths < 0
                ? currentDate.getFullYear() + year + years
                : currentDate.getFullYear() - year - years
        );

        // 設置月份，考慮天數的變化
        let targetMonth =
            totalMonths < 0
                ? currentDate.getMonth() + months
                : currentDate.getMonth() - months;
        let targetYear = currentDate.getFullYear();

        if (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
        }
        if (targetMonth > 11) {
            targetMonth -= 12;
            targetYear += 1;
        }

        const targetDate = new Date(targetYear, targetMonth + 1, 0); // 將日期設置為目標月份的最後一天

        if (currentDate.getDate() > targetDate.getDate()) {
            currentDate.setDate(targetDate.getDate());
        }

        // 設置月份和日期
        currentDate.setFullYear(targetDate.getFullYear());
        currentDate.setMonth(targetMonth);
        currentDate.setDate(currentDate.getDate() - day);
        return DateTimeFormate.dateToString({ date: currentDate, mode: DateTimeFormate.DateMode.yyyyMMdd, joinDate: "" });
    };

    /** 增加指定日期 之 任何時間單位 
     * @property {Date} date 指定日期
     * @property {number} years 欲增加之 - 年
     * @property {number} months 欲增加之 - 月
     * @property {number} days 欲增加之 - 日
     * @property {number} hours 欲增加之 - 時
     * @property {number} minutes 欲增加之 - 分
     * @property {number} seconds 欲增加之 - 秒
     * @returns '202407171330'
    */
    function addDateTime({ date, years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 }:
        { date: Date, years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number }) {
        // 添加時間
        date.setFullYear(date.getFullYear() + years);
        date.setMonth(date.getMonth() + months);
        date.setDate(date.getDate() + days);
        date.setHours(date.getHours() + hours);
        date.setMinutes(date.getMinutes() + minutes);
        date.setSeconds(date.getSeconds() + seconds);

        // 格式化輸出
        return date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);
    }

    return {
        DateMode,
        TimeFormate,
        isExistDate,
        todayDateFormate,
        dateToString,
        dateFormate,
        DateFormatSendBack,
        dateFormatObj,
        dateRegex,
        dateTimeRegex,
        getMonthStart,
        getMonthEnd,
        getSixMonthsAgoStartDate,
        getNextOrLastDate,
        getDayName,
        addDays,
        addDateTime,
        isDateBeforeToday,
        getDisableDate,
    }
})();

export interface calendarDataType {
    startTime: string,
    endTime: string,
    label: string,
    title: string,
    note?: string,
}

export interface calendarStatusType {
    name: string,
    color: string,
}