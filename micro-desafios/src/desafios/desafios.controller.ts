import { Controller, Logger } from '@nestjs/common';

import { DesafiosService } from './desafios.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  logger = new Logger(DesafiosController.name);
}
