import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';
import { DesafioDTO } from './dtos/desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Get()
  async consultarDesafios(): Promise<Desafio[]> {
    return await this.desafiosService.consultarDesafios();
  }

  @Get('/jogador/:jogadorId')
  async consultarDesafio(
    @Param('jogadorId', ValidacaoParametrosPipe) jogadorId: string,
  ): Promise<Desafio> {
    return await this.desafiosService.consultarDesafioPorJogadorId(jogadorId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() desafioDTO: DesafioDTO): Promise<void> {
    await this.desafiosService.criarDesafio(desafioDTO);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Body() desafioDTO: DesafioDTO,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, desafioDTO);
  }
}
