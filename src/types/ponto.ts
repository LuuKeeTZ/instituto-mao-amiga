export type TipoPonto = 'coleta' | 'distribuição';

export interface Ponto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: TipoPonto;
  /** O que o ponto recebe (coleta) ou entrega (distribuição). */
  itens: string[];
}
