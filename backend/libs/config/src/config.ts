import * as Joi from 'joi';

export const configSchema = Joi.object({
  SHEETS_ID: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('password'),
  DB_NAME: Joi.string().default('black_hole'),
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
});
