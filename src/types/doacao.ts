export interface Doacao {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  /** Data e hora do registro, em ISO 8601. */
  criadoEm: string;
}

/** O que o usuário digita no formulário, antes de virar uma Doacao. */
export interface DoacaoFormValores {
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
}

export type ErrosDoacao = Partial<Record<keyof DoacaoFormValores, string>>;
