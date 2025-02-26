import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { TasksModule } from './tasks/tasks.module';
import {
  typeOrmProdConfig,
  appConfigSchema,
  TConfigService,
  authConfig,
  AuthConfig,
} from './config';
import { User } from './users/entities';
import { Task, TaskLabel } from './tasks/entities';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './users/auth/auth.guard';
import { RolesGuard } from './users/auth/roles.guard';

/**
 * Application module.
 * Defines the application configuration and imports.
 */
@Module({
  imports: [
    // Configure the application configuration module
    ConfigModule.forRoot({
      load: [typeOrmProdConfig, authConfig],
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

    // Configure the authentication module
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: TConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.jwt.secret,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth')?.jwt.expiresIn,
        },
      }),
    }),

    // Import modules
    TasksModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
