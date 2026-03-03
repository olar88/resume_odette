import { allFetch, ResultObj } from "./api";

/**@description 查詢遊戲房間 (參數) */
export interface GameRoomSearchParams {
  game_id?: string;
}

/**@description 查詢遊戲房間 (回傳) */
export interface GameRoomSearchResItem {
  game_id: string;
  gamename: string;
  token: string;
}

/**@description 查詢遊戲房間 */
export const GameRoomSearch = async (
  obj: GameRoomSearchParams
): Promise<ResultObj<GameRoomSearchResItem[]>> =>
  await allFetch("Game/GameRoomSearch", obj);

/**@description 訪客模式進入遊戲 (參數) */
export interface JoinTheGameQRcodeParams {
  game_id: string;
  playername: string;
  token: string;
}

/**@description 訪客模式進入遊戲 */
export const JoinTheGameQRcode = async (
  obj: JoinTheGameQRcodeParams
): Promise<ResultObj<JoinTheGameResItem>> =>
  await allFetch("Game/JoinTheGameQRcode", obj);

/**@description 從ERP進入遊戲 (參數) */
export interface JoinTheGameERPParams {
  game_id: string;
  player_id: string;
  playername: string;
  token: string;
}

/**@description 玩家 進入遊戲 (回傳) */
export interface JoinTheGameResItem {
  game_id: string;
  player_id: string;
  token: string;
}

/**@description 從ERP進入遊戲 */
export const JoinTheGameERP = async (
  obj: JoinTheGameERPParams
): Promise<ResultObj<JoinTheGameResItem>> =>
  await allFetch("Game/JoinTheGameERP", obj);

/**@description 紀錄玩家答案 (參數) */
export interface SendAnsParams {
  game_id: string;
  player_id: string;
  gamequestion_id: string;
  answers: string;
  token: string;
}

/**@description 紀錄玩家答案 */
export const SendAns = async (obj: SendAnsParams): Promise<ResultObj> =>
  await allFetch("Game/SendAns", obj);

/**@description 判斷連線(玩家重連) (參數) */
export interface ConnectedOrNotParams {
  game_id: string;
  player_id: string;
  token: string;
}

/**@description 判斷連線(玩家重連) (回傳) */
export interface ConnectedOrNotResItem {
  gamequestion_id: string | false;
}

/**@description 判斷連線(玩家重連) */
export const ConnectedOrNot = async (
  obj: ConnectedOrNotParams
): Promise<ResultObj<ConnectedOrNotResItem>> =>
  await allFetch("Game/connectedOrNot", obj);
