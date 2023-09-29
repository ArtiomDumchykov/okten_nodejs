import joi from 'joi';

// import { regexConstant } from '../constatns';
import { EGenders } from '../enums';


export class UserValidator { 
    static firstName = joi.string().min(2).max(50).trim();
    static age = joi.number().min(1).max(255);
    static genders = joi.valid(...Object.values(EGenders));
    // static email = joi.string().regex(regexConstant.EMAIL).trim();
    // static password = joi.string().regex(regexConstant.PASSWORD).trim();
    static email = joi.string().trim();
    static password = joi.string().trim();
    

    static create = joi.object({
        name: this.firstName.required(),
        age: this.age.required(),
        genders: this.genders, 
        email:  this.email.required(),
        password: this.password.required(),
    })

    static update = joi.object({
        name: this.firstName,
        age: this.age,
        genders: this.genders,
    })
}


