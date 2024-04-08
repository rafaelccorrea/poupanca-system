import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @ApiProperty({ description: 'RefreshToken' })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
