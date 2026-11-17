import { ApiErro } from '../services/api';

/** Texto curto para mostrar ao usuário a partir de qualquer erro de chamada. */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiErro) {
    if (erro.status === 0) return erro.message;
    if (erro.status >= 500) return 'O servidor teve um problema. Tente de novo em instantes.';
    return erro.message;
  }
  return 'Algo deu errado. Tente de novo.';
}

export function ehNaoEncontrado(erro: unknown): boolean {
  return erro instanceof ApiErro && erro.status === 404;
}
