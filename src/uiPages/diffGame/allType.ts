export enum colorType {
  orange = "orange",
  yellow = "yellow",
  green = "green",
  greenRelaod = "greenRelaod",
  greenBack = "greenBack",
}

export type PageState = {
  isLoaded: boolean;
  isSend?: boolean;
  modalOpen: boolean;
  modalInner: ModalInnerType | null;
};

export type ModalInnerType = {
  id?: string;
  title: string;
  modalInner: React.ReactNode;
  size: "large" | "medium";
  modalBtnGorup?: React.ReactNode;
  modalAction?: Function;
};
