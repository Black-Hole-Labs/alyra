import * as Joi from 'joi';

export const configSchema = Joi.object({
  SHEETS_ID: Joi.string().required(),
  GOOGLE_CREDS_PRIVATE_KEY: Joi.string().required(),
  GOOGLE_CREDS_CLIENT_EMAIL: Joi.string().required(),
});
