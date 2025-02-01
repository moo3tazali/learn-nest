import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TasksModule } from './tasks/tasks.module';
import {
  typeOrmConfig,
  appConfigSchema,
  TConfigService,
  authConfig,
} from './config';
import { Task, TaskLabel } from './tasks/entities';
import { User } from './users/entities';
import { UsersModule } from './users/users.module';

/**
 * Application module.
 * Defines the application configuration and imports.
 */
@Module({
  imports: [
    // Configure the application configuration module
    ConfigModule.forRoot({
      load: [typeOrmConfig, authConfig],
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
      useFactory: async (configService: TConfigService) => ({
        ...(await configService.get('db')),
        entities: [Task, User, TaskLabel],
      }),
    }),

    // Import modules
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
