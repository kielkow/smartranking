import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';

@Module({
  imports: [],
  controllers: [DesafiosController],
  providers: [DesafiosService],
  exports: [DesafiosService],
})
export class DesafiosModule {}
