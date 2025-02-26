import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { AuthConfig } from './auth.config';

/**
 * Interface defining the shape of the application configuration.
 * This interface is used to type-check the configuration object.
 */
export interface ConfigType {
  /**
   * Database configuration options.
   * This property is used to configure the TypeORM database connection.
   */
  db: TypeOrmModuleOptions;
  auth: AuthConfig;
}

// extend the ConfigService class with the ConfigType interface
export class TConfigService extends ConfigService<ConfigType> {}

/**
 * Joi validation schema for the application configuration.
 * This schema defines the expected structure and constraints for the configuration object.
 */
export const appConfigSchema = Joi.object({
  /**
   * Database host.
   * Defaults to 'localhost' if not provided.
   */
  DB_HOST: Joi.string().default('localhost'),

  /**
   * Database port.
   * Defaults to 5432 if not provided.
   */
  DB_PORT: Joi.number().default(5432),

  /**
   * Database username.
   * Required.
   */
  DB_USERNAME: Joi.string().required(),

  /**
   * Database password.
   * Required.
   */
  DB_PASSWORD: Joi.string().required(),

  /**
   * Database name.
   * Required.
   */
  DB_NAME: Joi.string().required(),

  /**
   * Database synchronization flag.
   * 0: disable synchronization
   * 1: enable synchronization
   * Required.
   * Warning: Be careful when enabling synchronization, as it will drop all tables and recreate them.
   */
  DB_SYNC: Joi.number().valid(0, 1).required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
