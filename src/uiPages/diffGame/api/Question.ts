import { allFetch, ResultObj } from "./api";

/**@description 題目新建 (參數) */
export interface QuestionCreateParams {
    question: string,
}

/**@description 題目新建 */
export const QuestionCreate =
    async (obj: QuestionCreateParams):
        Promise<ResultObj> => await allFetch('Game/QuestionCreate', obj);

/**@description 題目修改 (參數) */
export interface QuestionUpdateParams {
    question_id: string,
    question: string,
}

/**@description 題目修改 */
export const QuestionUpdate =
    async (obj: QuestionUpdateParams):
        Promise<ResultObj> => await allFetch('Game/QuestionUpdate', obj);

/**@description 題目查詢 (參數) */
export interface QuestionSearchParams {
    question: string,
}

/**@description 題目查詢 (回傳) */
export interface QuestionSearchResItem {
    question_id: string,
    question: string,
}

/**@description 題目查詢 */
export const QuestionSearch =
    async (obj: QuestionSearchParams):
        Promise<ResultObj<QuestionSearchResItem[]>> => await allFetch('Game/QuestionSearch', obj);

/**@description 題目刪除 (參數) */
export interface QuestionDeleteParams {
    question_id: string,
}

/**@description 題目刪除 */
export const QuestionDelete =
    async (obj: QuestionDeleteParams):
        Promise<ResultObj> => await allFetch('Game/QuestionDelete', obj);