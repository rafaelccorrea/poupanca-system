import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '~/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    cellphone: string,
    cpf: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      cellphone,
      cpf,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByCellphone(cellphone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { cellphone } });
  }

  async findByCpf(cpf: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { cpf } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
