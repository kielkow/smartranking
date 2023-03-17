import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PartidasService {
  private readonly logger = new Logger(PartidasService.name);
}
