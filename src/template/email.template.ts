import { EEmailAction } from "../enum";

export const emailTemplates: {
  [key: string]: { templateName: string; subject: string };
} = {
  [EEmailAction.WELCOME]: {
    subject: "We are very happy, that you with us now",
    templateName: "welcome",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    subject: "Don't worry! You will be able to create new Password",
    templateName: "forgot.password",
  },
  [EEmailAction.ACTIVATE]: {
    subject: "Activate your email",
    templateName: "activate",
  },
};
