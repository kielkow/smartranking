import { Controller, Logger } from '@nestjs/common';

import { PartidasService } from './partidas.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  logger = new Logger(PartidasController.name);
}
