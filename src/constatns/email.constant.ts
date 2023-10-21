import { EEmailAction } from "../enums";

// type ITemplates = Record<EEmailAction, {
//     templateName: string;
//     subject: string;
// }>

type ITemplates = {
  [key: number]: {
    templateName: string;
    subject: string;
  };
};

export const templates: ITemplates = {
  [EEmailAction.REGISTER]: {
    templateName: "register",
    subject: "Wellcome",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Do not worry, we control your password",
  },
  [EEmailAction.CHANGED_PASSWORD]: {
    templateName: "chenged-password",
    subject: "Changed Password",
  },
};
