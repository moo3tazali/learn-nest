import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig, appConfigSchema, ConfigType } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Application module.
 * Defines the application configuration and imports.
 */
@Module({
  imports: [
    // Configure the application configuration module
    ConfigModule.forRoot({
      load: [typeOrmConfig],
      isGlobal: true,
      validationSchema: appConfigSchema,
      validationOptions: {
        // Enable strict mode to ensure that all required configuration properties are provided
        abortEarly: true,
      },
    }),

    // Configure the TypeORM database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<ConfigType>,
      ) => ({
        ...(await configService.get('db')),
      }),
    }),

    // Import the tasks module
    TasksModule,
  ],
})
export class AppModule {}
