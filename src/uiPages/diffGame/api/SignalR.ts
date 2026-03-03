import { allFetch, ResultObj } from "./api";

/**@description 新遊戲房間監聽 (回傳) */
export interface newRoomResItem {
    game_id: string,
    gamename: string,
    player_id: string,
    playername: string,
}

/**@description 玩家加入遊戲 (回傳) */
export interface joinGameResItem {
    game_id: string,
    gamename: string,
    player_id: string,
    playername: string,
    token?: string,
}

/**@description 交答案 (回傳) 
 * 要加 questionId ???
*/
export interface receiveAnsResItem {
    game_id: string,
    gamename: string,
    player_id: string,
    playername: string,
}


/**@description 玩家加入遊戲 (回傳) */
export interface nextQuestionResItem {
    game_id: string,
    gamename: string,
    player_id: string,
    playername: string,
    gamequestion_id:string,
}

/**@description 結束遊戲 (回傳) */
export interface WinResItem {
    game_id: string,
    player_id: string,
    playername: string,
}
