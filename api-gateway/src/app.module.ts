import { Module } from '@nestjs/common';

import { CategoriaController } from './categorias/categoria.controller';
import { JogadorController } from './jogadores/jogadores.controller';

@Module({
  imports: [],
  controllers: [CategoriaController, JogadorController],
  providers: [],
})
export class AppModule {}
