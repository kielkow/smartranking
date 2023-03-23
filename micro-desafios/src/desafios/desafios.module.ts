import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafioSchema } from './interfaces/desafio.schema';

import { PartidasModule } from 'src/partidas/partidas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Desafio',
        schema: DesafioSchema,
      },
    ]),
    PartidasModule,
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService],
  exports: [DesafiosService],
})
export class DesafiosModule {}
