import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../../database/entities/user.entity';

interface RefreshTokenStore {
  [userId: number]: string;
}

@Injectable()
export class AuthService {
  private refreshTokenStore: RefreshTokenStore = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      document: user.cpf,
      phone: user.cellphone,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<string | null> {
    const storedRefreshToken = this.refreshTokenStore[userId];
    if (storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('RefreshToken inválido');
    }

    delete this.refreshTokenStore[userId];
    const user = await this.userService.findById(userId);
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      document: user.cpf,
      phone: user.cellphone,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  }

  private generateRefreshToken(userId: string): string {
    const refreshToken = Math.random().toString(36).substr(2);
    this.refreshTokenStore[userId] = refreshToken;
    return refreshToken;
  }
}
