import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { JogadorDTO } from './dtos/jogador.dto';

@Controller('api/v1')
export class JogadorController {
  private logger = new Logger(JogadorController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('jogadores')
  @UsePipes(ValidationPipe)
  criarJogador(@Body() jogadorDTO: JogadorDTO) {
    this.logger.log(`criar-jogador: ${JSON.stringify(jogadorDTO)}`);

    this.clientAdminBackend.emit('criar-jogador', jogadorDTO);
  }

  @Get('jogadores')
  consultarJogadores(@Query('id') id: string): Observable<any> {
    this.logger.log(`consultar-jogadores: ${id}`);

    return this.clientAdminBackend.send('consultar-jogadores', id || '');
  }
}
