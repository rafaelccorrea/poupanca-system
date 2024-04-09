import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 100.5, description: 'Valor da transação' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário que está realizando a transação',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 1,
    description: 'ID da poupança relacionada à transação',
  })
  @IsNotEmpty()
  @IsNumber()
  savingsId: number;
}
