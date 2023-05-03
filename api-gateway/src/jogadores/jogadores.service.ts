import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Observable, lastValueFrom } from 'rxjs';

import { JogadorDTO } from './dtos/jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { AtualizarJogadorDTO } from './dtos/atualizarJogador.dto';

import { AwsS3Service } from 'src/aws/aws-s3.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { ClientProxyFactoryProvider } from 'src/common/providers/client-proxy/client-proxy-provider-factory';

@Injectable()
export class JogadoresService {
  constructor(
    private clientProxyFactoryProvider: ClientProxyFactoryProvider,
    private awsS3Service: AwsS3Service,
    private categoriasService: CategoriasService,
  ) {}

  private clientAdminBackend =
    this.clientProxyFactoryProvider.getClientProxyInstance();

  private readonly logger = new Logger(JogadoresService.name);

  async verificarJogadorExiste(id: string): Promise<Jogador> {
    this.logger.log(`verificar-jogador-existe: ${id}`);

    const jogador: Jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', id),
    );
    if (!jogador) {
      throw new BadRequestException(`Jogador ${id} não encontrado`);
    }

    return jogador;
  }

  async criarJogador(jogadorDTO: JogadorDTO) {
    this.logger.log(`criar-jogador: ${JSON.stringify(jogadorDTO)}`);

    await this.categoriasService.verificarCategoriaExiste(jogadorDTO.categoria);

    this.clientAdminBackend.emit('criar-jogador', jogadorDTO);
  }

  consultarJogadores(id: string): Observable<any> {
    this.logger.log(`consultar-jogadores: ${id}`);

    return this.clientAdminBackend.send('consultar-jogadores', id || '');
  }

  async atualizarJogador(id: string, atualizarJogadorDTO: AtualizarJogadorDTO) {
    this.logger.log(
      `atualizar-jogador: ${JSON.stringify(atualizarJogadorDTO)}`,
    );

    if (atualizarJogadorDTO.categoria) {
      await this.categoriasService.verificarCategoriaExiste(
        atualizarJogadorDTO.categoria,
      );
    }

    this.clientAdminBackend.emit('atualizar-jogador', {
      id,
      jogador: atualizarJogadorDTO,
    });
  }

  deletarJogador(id: string) {
    this.logger.log(`deletar-jogador: ${id}`);

    this.clientAdminBackend.emit('deletar-jogador', id);
  }

  async uploadArquivo(file: any, id: string): Promise<Observable<any>> {
    this.logger.log(`upload-arquivo-jogador: id(${id})-file(${file})`);

    const { url: urlFotoJogador } = await this.awsS3Service.uploadArquivo(
      file,
      id,
    );

    await lastValueFrom(
      this.clientAdminBackend.emit('atualizar-jogador', {
        id,
        jogador: { urlFotoJogador },
      }),
    );

    return this.clientAdminBackend.send('consultar-jogadores', id);
  }
}
