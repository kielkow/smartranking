import { Injectable, Logger } from '@nestjs/common';
import { Partida } from './interfaces/partida.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
  ) {}

  private readonly logger = new Logger(PartidasService.name);

  async consultarPartidas(): Promise<Partida[]> {
    return await this.partidaModel.find().exec();
  }
}
