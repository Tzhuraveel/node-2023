import * as path from "node:path";

import EmailTemplates from "email-templates";
import nodemailer from "nodemailer";

import { configs } from "../config";
import { EEmailAction } from "../enum";
import { emailTemplates } from "../template";
import { IUser } from "../type";

class EmailService {
  private transporter;
  private templateParser;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configs.EMAIL,
        pass: configs.EMAIL_PASSWORD,
      },
    });
    this.templateParser = new EmailTemplates({
      views: {
        root: path.join(process.cwd(), "src", "static"),
        options: {
          extension: "hbs",
        },
      },
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.join(process.cwd(), "src", "static", "css"),
        },
      },
    });
  }

  public async sendMail(
    user: IUser,
    emailAction: EEmailAction,
    locals: Record<string, string> = {}
  ) {
    const chosenTemplate = emailTemplates[emailAction];

    const html = await this.templateParser.render(chosenTemplate.templateName, {
      user,
      frontUrl: configs.FRONT_URL,
      locals,
    });

    return this.transporter.sendMail({
      from: "No reply",
      to: user.email,
      subject: chosenTemplate.subject,
      html,
    });
  }
}
export const emailService = new EmailService();
