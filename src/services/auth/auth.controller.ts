import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Authenticação de usuários')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Atualizar token de acesso' })
  @ApiResponse({
    status: 200,
    description: 'Token de acesso atualizado com sucesso.',
  })
  @ApiUnauthorizedResponse({ description: 'RefreshToken inválido.' })
  @ApiBadRequestResponse({ description: 'Solicitação inválida.' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { userId, refreshToken } = refreshTokenDto;
    const newAccessToken = await this.authService.refreshToken(
      userId,
      refreshToken,
    );
    if (!newAccessToken) {
      throw new UnauthorizedException('RefreshToken inválido');
    }
    return { accessToken: newAccessToken };
  }
}
