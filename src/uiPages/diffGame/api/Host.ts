import { allFetch, ResultObj } from "./api";

/**@description 開一局新遊戲 (參數) */
export interface GameCreateParams {
    gamename: string,
}

/**@description 開一局新遊戲 (回傳) */
export interface GameCreateResItem {
    game_id: string,
    token: string,
}

/**@description 開一局新遊戲 */
export const GameCreate =
    async (obj: GameCreateParams):
        Promise<ResultObj<GameCreateResItem>> => await allFetch('Game/GameCreate', obj);

// /**@description 新建遊戲產生QRcode並儲存 (參數) */
// export interface GameQRcodeParams {
//     game_id: string,
//     gameQRcode: string,
// }

// /**@description 新建遊戲產生QRcode並儲存 */
// export const GameQRcode =
//     async (obj: GameQRcodeParams):
//         Promise<ResultObj> => await allFetch('Game/GameQRcode', obj);


/**@description 玩家查詢 (參數) */
export interface SearchPlayersParams {
    game_id: string,
    token: string,
}

/**@description 玩家查詢 (回傳) */
export interface SearchPlayersResItem {
    game_id: string;
    player_id: string;
    playername: string;
    token: string,
}

/**@description 玩家查詢 */
export const SearchPlayers =
    async (obj: SearchPlayersParams):
        Promise<ResultObj<SearchPlayersResItem[]>> => await allFetch('Game/SearchPlayers', obj);

/**@description 抽新題目 (參數) */
export interface SelecteQuestionParams {
    game_id: string,
    token: string,
}

/**@description 抽新題目 (回傳) */
export interface SelecteQuestionResItem {
    game_id: string,
    question_id: string,
    gamequestion_id: string,
    question: string,
}

/**@description 抽新題目 */
export const SelecteQuestion =
    async (obj: SelecteQuestionParams):
        Promise<ResultObj<SelecteQuestionResItem>> => await allFetch('Game/SelecteQuestion', obj);

/**@description 查出所有玩家答案 (參數) */
export interface searchPlayersAnsParams {
    gamequestion_id: string,
    checkAnsorNot:boolean,
    token: string,
}

/**@description 查出所有玩家答案 (回傳) */
export interface searchPlayersAnsResItem {
    player_id: string,
    playername: string,
    gamequestion_id: string,
    answer: string,
    token: string,
}

/**@description 查出所有玩家答案 */
export const searchPlayersAns =
    async (obj: searchPlayersAnsParams):
        Promise<ResultObj<searchPlayersAnsResItem[]>> => await allFetch('Game/searchPlayersAns', obj);

/**@description 計算該題的扣分 (參數) */
export interface IntergalScoreParams {
    ScoreDetail: {
        player_id: string,
        gamequestion_id: string,
        game_id: string,
        token: string,
    }[],
}

/**@description 計算該題的扣分 */
export const IntergalScore =
    async (obj: IntergalScoreParams):
        Promise<ResultObj> => await allFetch('Game/IntergalScore', obj);

/**@description 結束該局遊戲 (參數) */
export interface EndGameParams {
    game_id?: string,
    player_id?: string,
    token: string,
}

/**@description 結束該局遊戲 */
export const EndGame =
    async (obj: EndGameParams):
        Promise<ResultObj> => await allFetch('Game/EndGame', obj);

/**@description 排名查詢 (參數) */
export interface RankSearchParams {
    player_id?: string,
    game_id: string,
    token: string,
    theEnd: boolean,
}

/**@description 排名查詢 (回傳) */
export interface RankSearchResItem {
    player_id: string,
    playername: string,
    playertotalscore: string,
    token: string,
}

/**@description 排名查詢 */
export const RankSearch =
    async (obj: RankSearchParams):
        Promise<ResultObj<RankSearchResItem[]>> => await allFetch('Game/RankSearch', obj);

/**@description 原房間開一局新遊戲 (參數) */
export interface RenewGameParams {
    game_id: string,
    token: string,
}

/**@description 原房間開一局新遊戲 */
export const RenewGame =
    async (obj: RenewGameParams):
        Promise<ResultObj> => await allFetch('Game/RenewGame', obj);


/**@description 查最新的出題 (參數) */
export interface SearchNewestQuestionParams {
    game_id: string,
    token: string,
}

/**@description 查最新的出題 (回傳) */
export interface SearchNewestQuestionResItem {
    checkAnswer: string;
    gamequestion_id: string;
    question: string;
    // TODO 帶API好有狀態不同
}

/**@description 查最新的出題 */
export const SearchNewestQuestion =
    async (obj: SearchNewestQuestionParams):
        Promise<ResultObj<SearchNewestQuestionResItem[]>> => await allFetch('Game/searchNewestQuestion', obj);