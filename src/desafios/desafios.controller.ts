import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafioDTO } from './dtos/desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() desafioDTO: DesafioDTO): Promise<void> {
    await this.desafiosService.criarDesafio(desafioDTO);
  }
}
