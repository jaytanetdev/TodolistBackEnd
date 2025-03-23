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
  clientUrl: 'postgres:ISCvcFqZrLuhsaWOLbOaDfMkYHzwGHOD@tramway.proxy.rlwy.net:17989/railway'
  // dbName: configService.get('POSTGRES_DB') || 'railway',
  // user: configService.get('POSTGRES_USER') || 'postgres',
  // password: configService.get('POSTGRES_PASSWORD') || 'ISCvcFqZrLuhsaWOLbOaDfMkYHzwGHOD',
  // host: configService.get('POSTGRES_HOST') || 'postgres.railway.internal',
  // port: configService.get('POSTGRES_PORT') || 5432,

};

export default MikroOrmConfig;
