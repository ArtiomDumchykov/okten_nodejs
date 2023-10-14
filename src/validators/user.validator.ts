import joi from "joi";

// import { regexConstant } from '../constatns';
import { EGenders } from "../enums";

export class UserValidator {
  static firstName = joi.string().min(2).max(50).trim();
  static age = joi.number().min(1).max(255);
  static genders = joi.valid(...Object.values(EGenders));
  // static email = joi.string().regex(regexConstant.EMAIL).trim();
  // static password = joi.string().regex(regexConstant.PASSWORD).trim();
  static email = joi.string().trim();
  static password = joi.string().trim();

  static register = joi.object({
    name: this.firstName.required(),
    age: this.age.required(),
    genders: this.genders,
    email: this.email.required(),
    password: this.password.required(),
  });

  static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static update = joi.object({
    name: this.firstName,
    age: this.age,
    genders: this.genders,
  });

  static forgotPassword = joi.object({
    email: this.email.required(),
  });

  static setForgotPassword = joi.object({
    newPassword: this.password.required(),
  });

  static setNewPassword = joi.object({
    password: this.password.required(),
    newPassword: this.password.required(),
  });
}
