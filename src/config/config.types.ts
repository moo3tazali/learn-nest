import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
}

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
});
