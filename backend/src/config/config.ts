import * as Joi from 'joi';

export const configSchema = Joi.object({
  SHEETS_ID: Joi.string().required(),
});
