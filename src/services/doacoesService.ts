import { Doacao } from '../types/doacao';
import { Pagina } from '../types/pagina';
import { del, get, montarQuery, post, put } from './api';

// Tudo o que o app faz com doações passa por aqui (e daqui pelo api.ts).

export type DoacaoDados = Omit<Doacao, 'id' | 'criadoEm'>;

export const TAMANHO_PAGINA_DOACOES = 10;

/** Página do histórico, da mais nova para a mais antiga; o filtro procura no tipo de item. */
export function buscarPaginaDoacoes(filtro: string, pagina: number, tamanho = TAMANHO_PAGINA_DOACOES) {
  return get<Pagina<Doacao>>(
    `/doacoes/filtro${montarQuery({ filtro: filtro.trim(), page: pagina, size: tamanho })}`,
  );
}

export function buscarDoacaoPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/doacoes/${encodeURIComponent(id)}`);
}

export function cadastrarDoacao(dados: DoacaoDados): Promise<Doacao> {
  return post<Doacao>('/doacoes', dados);
}

export function editarDoacao(id: string, dados: DoacaoDados): Promise<Doacao> {
  return put<Doacao>(`/doacoes/${encodeURIComponent(id)}`, dados);
}

export function excluirDoacao(id: string): Promise<void> {
  return del(`/doacoes/${encodeURIComponent(id)}`);
}
