import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 100.5, description: 'Valor da transação' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 1,
    description: 'ID da poupança relacionada à transação',
  })
  @IsNotEmpty()
  @IsNumber()
  savingsId: number;
}
