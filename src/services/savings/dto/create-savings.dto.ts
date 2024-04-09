import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSavingsDto {
  @ApiProperty({ example: 'Minha Poupança', description: 'Nome da poupança' })
  @IsNotEmpty()
  name: string;
}
