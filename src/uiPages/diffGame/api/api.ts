import * as Question from "./Question";
import * as Host from "./Host";
import * as Player from "./Player";

let domain = "https://erp.genesys-tech.com/api/";

export { Question, Host, Player };

export type ResultObj<T = any, T2 = any> = {
  success: boolean;
  data: T;
  message: string;
  dt2?: T2 | null;
  page?: number;
  error?: T;
  title?: string;
};

// call api
export const allFetch = async (
  uri: string = "",
  obj: any = {}
): Promise<ResultObj> => {
  try {
    const response = await fetch(domain + uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(obj),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error in allFetch:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    };
  }
};
