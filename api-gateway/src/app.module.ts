import { Module } from '@nestjs/common';
import { CategoriaController } from './categorias/categoria.controller';

@Module({
  imports: [],
  controllers: [CategoriaController],
  providers: [],
})
export class AppModule {}
