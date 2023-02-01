import { BadRequestException, PipeTransform } from '@nestjs/common';

import { DesafioStatus } from '../interfaces/desafio-status.enum';

export class DesafioStatusPipe implements PipeTransform {
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.statusValido(status)) {
      throw new BadRequestException(`${status} é um status invalido.`);
    }

    value.status = value.status.toUpperCase();

    return value;
  }

  private statusValido(status: any) {
    const index = this.statusPermitidos.indexOf(status);

    return index !== -1;
  }
}
