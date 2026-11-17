export type TipoPonto = 'coleta' | 'distribuição';

/** Ponto como a API devolve (PontoResponseDTO). */
export interface Ponto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: TipoPonto;
}

/** O que o app envia para cadastrar ou editar (PontoRequestDTO). */
export type PontoDados = Omit<Ponto, 'id'>;
