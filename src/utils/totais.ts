import { Doacao } from '../types/doacao';

export interface TotalPorTipo {
  tipo: string;
  unidades: number;
  doacoes: number;
}

export interface Resumo {
  totalDoacoes: number;
  totalUnidades: number;
  porTipo: TotalPorTipo[];
}

/**
 * Soma as doações por tipo de item. "Roupa" e "roupa " contam como o mesmo tipo.
 * Nada disso é salvo: é recalculado a partir do array sempre que a tela renderiza,
 * então nunca fica desatualizado depois de cadastrar, editar ou excluir.
 */
export function calcularResumo(doacoes: Doacao[]): Resumo {
  const grupos = new Map<string, TotalPorTipo>();
  for (const d of doacoes) {
    const chave = d.tipoItem.trim().toLocaleLowerCase('pt-BR');
    const atual = grupos.get(chave) ?? { tipo: d.tipoItem.trim(), unidades: 0, doacoes: 0 };
    atual.unidades += d.quantidade;
    atual.doacoes += 1;
    grupos.set(chave, atual);
  }
  const porTipo = [...grupos.values()].sort(
    (a, b) => b.unidades - a.unidades || a.tipo.localeCompare(b.tipo),
  );
  return {
    totalDoacoes: doacoes.length,
    totalUnidades: porTipo.reduce((soma, t) => soma + t.unidades, 0),
    porTipo,
  };
}
