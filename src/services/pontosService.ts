import { Pagina } from '../types/pagina';
import { Ponto, PontoDados } from '../types/ponto';
import { del, get, montarQuery, post, put } from './api';

// Tudo o que o app faz com pontos passa por aqui. As telas não montam URL.

export const TAMANHO_PAGINA = 10;

export function listarPontos(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}

export function buscarPaginaPontos(filtro: string, pagina: number, tamanho = TAMANHO_PAGINA) {
  return get<Pagina<Ponto>>(
    `/pontos/filtro${montarQuery({ filtro: filtro.trim(), page: pagina, size: tamanho })}`,
  );
}

export function buscarPontoPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
}

export function cadastrarPonto(dados: PontoDados): Promise<Ponto> {
  return post<Ponto>('/pontos', dados);
}

export function editarPonto(id: string, dados: PontoDados): Promise<Ponto> {
  return put<Ponto>(`/pontos/${encodeURIComponent(id)}`, dados);
}

export function excluirPonto(id: string): Promise<void> {
  return del(`/pontos/${encodeURIComponent(id)}`);
}
