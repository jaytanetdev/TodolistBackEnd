import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginRequestDto, LoginResponseDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TAuthConfig } from 'src/config/auth.config';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import ICurrentUser from './interfaces/current-user.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configSvc: ConfigService,
  ) {}

  public static setCookie(
    response: Response,
    params: {
      name: string;
      value: string;
      maxAge: number;
    },
  ) {
    response.cookie(params.name, params.value, {
      maxAge: params.maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      signed: true,
    });
  }
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async registerPassword(
    @Body() registerDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);
    const authConfig = this.configSvc.get<TAuthConfig>('auth');
    AuthController.setCookie(response, {
      name: authConfig!.cookie.refresh.name,
      value: result.refreshToken,
      maxAge: authConfig!.cookie.refresh.maxAge, // 7 days
    });

    AuthController.setCookie(response, {
      name: authConfig!.cookie.access.name,
      value: result.accessToken,
      maxAge: authConfig!.cookie.access.maxAge, // 7 days
    });

    return {
      success: true,
      result,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with email/password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async loginPassword(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.loginPassword(loginDto);
    const authConfig = this.configSvc.get<TAuthConfig>('auth');

    AuthController.setCookie(response, {
      name: authConfig!.cookie.refresh.name,
      value: result.refreshToken,
      maxAge: authConfig!.cookie.refresh.maxAge, // 7 days
    });

    AuthController.setCookie(response, {
      name: authConfig!.cookie.access.name,
      value: result.accessToken,
      maxAge: authConfig!.cookie.access.maxAge, // 7 days
    });

    return {
      success: true,
      result,
    };
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens successfully refreshed',
  })
  async refresh(
    @CurrentUser() user: ICurrentUser & { refreshToken: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refresh(
      user.id,
      user.refreshToken,
      user.issueAt,
      user.methodType,
    );

    const authConfig = this.configSvc.get<TAuthConfig>('auth');

    AuthController.setCookie(response, {
      name: 'Authentication',
      value: result.accessToken,
      maxAge: authConfig!.cookie.access.maxAge, // 7 days
    });

    return {
      success: true,
      result,
    };
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    const authConfig = this.configSvc.get<TAuthConfig>('auth');
    AuthController.setCookie(response, {
      name: authConfig!.cookie.refresh.name,
      value: '',
      maxAge: 0,
    });

    AuthController.setCookie(response, {
      name: authConfig!.cookie.access.name,
      value: '',
      maxAge: 0,
    });

    return {
      success: true,
    };
  }
}
