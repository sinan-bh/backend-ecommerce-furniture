const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  uname: Joi.string().required(),
  pass: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

module.exports = userValidationSchema;
