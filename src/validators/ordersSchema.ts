import Joi from 'joi'

export const placeOrderSchema = Joi.array().items(
  Joi.object({
    quantity: Joi.number().required(),
    product_id: Joi.number().required()
  })
);