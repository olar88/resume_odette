/**
 * 節流函式：限制指定函式在 delay 時間內只能執行一次，防止高頻率觸發。
 * @param fn - 需要被節流的目標函式
 * @param delay - 節流的時間間隔（毫秒）
 * @returns 一個已套用節流機制的函式
 */
export default function throttle(fn: Function, delay: number) {
    let lastCall = 0;

    return function (...args: any[]) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        fn(...args);
    };
}