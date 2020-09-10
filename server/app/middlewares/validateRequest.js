const Joi = require('joi');


module.exports = {
  validateRequest: (requestType, schema) => {
    return (req, res, next) => {
      let field = '';
      switch (requestType) {
        case 'GET':
        case 'DELETE':
          field = 'query';
          break;
        default:
          field = 'body'
      }
      const result = schema.validate(req[field]);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) req.value = {};
      req.value[field] = result.value;
      next();
    }
  },

  schemas: {
    signUpSchema: Joi.object().keys({
      contact_title: Joi.string().valid("Mr", "Mrs", "Ms").optional(),
      first_name: Joi.string().required(),
      last_name: Joi.string().optional(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phone: Joi.string().optional(),
      profile_picture: Joi.string().optional()
    }),
    signInOauth2Schema: Joi.object().keys({
      code: Joi.string().required()
    }),
    deleteContactSchema: Joi.object().keys({
      resourceName: Joi.string().required()
    }),
  }
};
