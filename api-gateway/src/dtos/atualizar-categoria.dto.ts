import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class AtualizarCategoriaDTO {
  @IsString()
  @IsOptional()
  readonly categoria: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  eventos: Array<Evento>;
}

interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}
