import Joi from 'joi'
const addCategorySchema = Joi.object({
    name: Joi.string().required().min(1).max(50),
});

export { addCategorySchema };