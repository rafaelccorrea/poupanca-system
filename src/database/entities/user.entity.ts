import { Entity, PrimaryColumn, Column, Unique } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique(['email', 'cellphone', 'cpf'])
export class User {
  @PrimaryColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cellphone: string;

  @Column()
  cpf: string;
}
