import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsCpfValid } from '../../../helpers/is-cpf-valid';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '31999111111',
    description: 'Número de celular do usuário',
  })
  @IsString()
  @IsPhoneNumber('BR')
  @IsNotEmpty()
  cellphone: string;

  @ApiProperty({
    description: 'CPF (Cadastro de Pessoas Físicas)',
    example: '72093759020',
  })
  @IsString()
  @Length(11, 11)
  @Validate(IsCpfValid)
  cpf: string;
}
