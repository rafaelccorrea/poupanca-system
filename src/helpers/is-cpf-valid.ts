import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsCpfValid', async: false })
@Injectable()
export class IsCpfValid implements ValidatorConstraintInterface {
  validate(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
      return false; // Verifica se o CPF tem 11 dígitos e se não é uma sequência de dígitos repetidos
    }

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false; // Verifica o primeiro dígito verificador
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false; // Verifica o segundo dígito verificador
    }

    return true; // CPF válido
  }

  defaultMessage() {
    return 'Invalid CPF number';
  }
}
