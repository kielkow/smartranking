import { Module } from '@nestjs/common';
import { CategoriaController } from './categorias/caregoria.controller';

@Module({
  imports: [],
  controllers: [CategoriaController],
  providers: [],
})
export class AppModule {}
