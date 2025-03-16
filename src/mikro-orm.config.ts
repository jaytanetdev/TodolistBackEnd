import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
const MikroOrmConfig: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  dbName: configService.get('POSTGRES_DB') || 'todolist',
  user: configService.get('POSTGRES_USER') || 'root',
  password: configService.get('POSTGRES_PASSWORD') || '123123Jay',
  host: configService.get('POSTGRES_HOST') || 'localhost',
  port: configService.get('POSTGRES_PORT') || 5432,
};

export default MikroOrmConfig;
