import { registerAs } from '@nestjs/config';
import parse from 'parse-duration';

export type TAuthConfig = {
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;

  refreshTokenSecret: string;
  resetPasswordTokenSecret: string;

  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;

  cookie: {
    access: {
      name: string;
      maxAge: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none';
    };
    refresh: {
      name: string;
      maxAge: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none';
    };
    csrf: {
      name: string;
      maxAge: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none';
    };
    signedSecret: string;
  };
};

export default registerAs(
  'auth',
  (): TAuthConfig => ({
    accessTokenPrivateKey:
      process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    accessTokenPublicKey:
      process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n') || '',

    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || '',
    resetPasswordTokenSecret: process.env.JWT_RESET_PASSWORD_SECRET || '',

    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Cookie configurations
    cookie: {
      // Access token cookie settings
      access: {
        name: process.env.COOKIE_ACCESS_TOKEN_NAME ?? 'Authentication',
        maxAge:
          parseInt(process.env.COOKIE_ACCESS_TOKEN_MAX_AGE ?? '0', 10) ||
          7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      // Refresh token cookie settings
      refresh: {
        name: process.env.COOKIE_REFRESH_TOKEN_NAME ?? 'Refresh',
        maxAge:
          parseInt(process.env.COOKIE_REFRESH_TOKEN_MAX_AGE ?? '0', 10) ||
          7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      csrf: {
        name:
          process.env.NODE_ENV === 'production'
            ? '__Host-psifi.x-csrf-token'
            : 'x-csrf-token',
        httpOnly: true,
        maxAge: 60 * 1000,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      },
      signedSecret: process.env.COOKIE_SIGNED_SECRET || 'SUPER_SECRET',
    },
  }),
);
