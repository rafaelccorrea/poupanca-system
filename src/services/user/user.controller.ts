import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '~/database/entities/user.entity';

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiCreatedResponse({ description: 'Usuário registrado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, cellphone, cpf } = createUserDto;

    const existingEmailUser = await this.userService.findByEmail(email);
    if (existingEmailUser) {
      throw new BadRequestException('Email já está em uso');
    }

    const existingCellphoneUser =
      await this.userService.findByCellphone(cellphone);
    if (existingCellphoneUser) {
      throw new BadRequestException('Número de celular já está em uso');
    }

    const existingCpfUser = await this.userService.findByCpf(cpf);
    if (existingCpfUser) {
      throw new BadRequestException('CPF já está em uso');
    }

    return await this.userService.createUser(
      name,
      email,
      password,
      cellphone,
      cpf,
    );
  }
}
