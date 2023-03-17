import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DesafiosService {
  private readonly logger = new Logger(DesafiosService.name);
}
