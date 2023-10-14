import joi from "joi";

export class CarValidator {
  static year = joi.number().min(1970).max(2023);
  static model = joi.string().min(2).max(42).trim();
  static manufacture = joi.string().min(2).max(42).trim();
  static price = joi.number().min(0).max(100_000_000);

  static create = joi.object({
    year: this.year.required(),
    model: this.model.required(),
    manufacture: this.manufacture.required(),
    price: this.price.required(),
  });

  static update = joi.object({
    year: this.year,
    model: this.model,
    price: this.price,
  });
}
