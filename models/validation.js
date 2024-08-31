const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  userName: Joi.string().required(),
  pass: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const productsValidationSchema = Joi.object({
  title: Joi.string(),
  image: Joi.string(),
  description: Joi.string(),
  price: Joi.number().positive(),
  offerPrice: Joi.number().positive(),
  category: Joi.string(),
  details: Joi.string(),
  type: Joi.string(),
  quantity: Joi.string(),
})

module.exports = {userValidationSchema, productsValidationSchema};
