const Joi = require('joi');

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .regex(/^[a-zA-Zа-яА-яёЁіІїЇ]{1,41}$/)
      .min(2)
      .max(42)
      .messages({
        'string.base': 'Ім\'я користувача повинно бути текстовим рядком',
        'string.pattern.base': 'Ім\'я користувача не відповідає вимогам',
        'string.min': 'Ім\'я користувача повинно містити щонайменше {#limit} символів',
        'string.max': 'Ім\'я користувача може містити максимум {#limit} символів'
      }),
    email: Joi.string()
      .email()
      .messages({
        'string.base': 'Поле email повинно бути текстовим рядком',
        'string.email': 'Введіть правильну адресу електронної пошти',
      }),
  });

  return schema.validate(data);
};

module.exports = validateUser;
