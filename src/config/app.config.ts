import { registerAs } from '@nestjs/config';

export type TAppConfig = {
  port: number;
  nodeEnv: string;
  backendHost: string;
  frontendHost: string;
  afterSuccessfulLoginUrl: string;
};

export default registerAs(
  'app',
  (): TAppConfig => ({
    port: parseInt(process.env.PORT!, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    backendHost: process.env.BACKEND_HOSTNAME || 'http://localhost:5000',
    frontendHost: process.env.FRONTEND_HOSTNAME || 'http://localhost:3000',
    afterSuccessfulLoginUrl: process.env.AFTER_SUCCESSFUL_LOGIN_URL || '',
  }),
);
