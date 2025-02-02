import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  // Specify the database type (in this case, PostgreSQL)
  type: 'postgres',

  // Set the database host (defaults to 'localhost' if not provided)
  host: process.env.DB_HOST ?? 'localhost',

  // Set the database port (defaults to 5432 if not provided)
  port: parseInt(process.env.DB_PORT ?? '5432'),

  // Set the database username (defaults to 'postgres' if not provided)
  username: process.env.DB_USERNAME ?? 'postgres',

  // Set the database password (defaults to 'postgres' if not provided)
  password: process.env.DB_PASSWORD ?? 'postgres',

  // Set the database name (defaults to 'tasks' if not provided)
  database: process.env.DB_NAME ?? 'tasks',

  // Set the entities to be loaded
  synchronize: false,

  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
});
