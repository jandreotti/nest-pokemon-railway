//! Este es un validation Schema. QUe el objeto luzca como yo espero
//! Valido que en el .env haya estos valores

import * as  Joi from "joi";


export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'testing').default('dev'),

  PORT: Joi.number().default(3000), // Si no facilitan el puerto va a ser 3000

  MONGODB_URL: Joi.string().required(),
  MONGODB_DB: Joi.string().required(),
  MONGODB_USER: Joi.string().required(),
  MONGODB_PASS: Joi.string().required(),

  DEFAULT_LIMIT: Joi.number().default(7)
});