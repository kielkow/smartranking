import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Partida } from './interfaces/partida.interface';

import { DesafiosService } from 'src/desafios/desafios.service';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly desafiosService: DesafiosService,
  ) {}

  private readonly logger = new Logger(PartidasService.name);

  async atribuirDesafioPartida(
    desafioID: string,
    desafioResultado: any,
  ): Promise<void> {
    try {
      this.logger.log(JSON.stringify({ desafioID, desafioResultado }));

      const desafio = await this.desafiosService.consultarDesafioPorID(
        desafioID,
      );

      const partida = new this.partidaModel({
        categoria: desafio.categoria,
        desafio: desafioID,
        jogadores: desafio.jogadores,
        def: desafioResultado.def,
        resultado: desafioResultado.resultado,
      });

      await partida.save();

      await this.desafiosService.atribuirDesafioPartida(desafio.id, partida.id);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}
