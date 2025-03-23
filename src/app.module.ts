import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UsersModule } from './modules/users/users.module';
import { TodoModule } from './modules/todo/todo.module';
import { AuthModule } from './modules/auth/auth.module';
import authConfig from './config/auth.config';
import { NotificationModule } from './modules/notification/notification.module';
import lineConfig from './config/line.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [authConfig,lineConfig,appConfig],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        clientUrl: configService.get<string>('DATABASE_URL'),
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        // dbName: configService.get('POSTGRES_DB'),
        // user: configService.get('POSTGRES_USER'),
        // password: configService.get('POSTGRES_PASSWORD'),
        // host: configService.get('POSTGRES_HOST'),
        // port: configService.get('POSTGRES_PORT'),
        driver: PostgreSqlDriver,
        debug: configService.get<string>('ENV') !== 'production',
        migrations: {
          path: './dist/migrations',
          pathTs: './src/migrations',
        },
      }),
    }),
    UsersModule,
    TodoModule,
    AuthModule,
    NotificationModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



