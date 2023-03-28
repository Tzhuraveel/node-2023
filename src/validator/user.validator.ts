import * as Joi from "joi";

import { regexConstants } from "../constant";
import { EGenders } from "../enum";

export class UserValidator {
  private static firstname = Joi.string().min(2).max(50).trim();
  private static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim();
  private static password = Joi.string().trim().regex(regexConstants.PASSWORD);
  private static gender = Joi.string().valid(...Object.values(EGenders));

  public static createUser = Joi.object({
    name: this.firstname.required(),
    email: this.email.required(),
    password: this.password.required(),
    gender: this.gender.required(),
  });
  public static updateUser = Joi.object({
    name: this.firstname,
    gender: this.gender,
  });

  public static loginUser = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static changePassword = Joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });

  public static emailValidator = Joi.object({
    email: this.email.required(),
  });

  public static updateForgotPassword = Joi.object({
    password: this.password.required(),
  });
}
