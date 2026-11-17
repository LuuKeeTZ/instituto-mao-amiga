import { DoacaoFormValores, ErrosDoacao } from '../types/doacao';

/**
 * Regras do formulário de doação. Devolve um objeto vazio quando está tudo certo.
 * Usada tanto no cadastro quanto na edição, para as regras serem sempre as mesmas.
 */
export function validarDoacao(valores: DoacaoFormValores): ErrosDoacao {
  const erros: ErrosDoacao = {};

  const tipo = valores.tipoItem.trim();
  if (!tipo) {
    erros.tipoItem = 'Informe o que está sendo doado.';
  } else if (tipo.length < 3) {
    erros.tipoItem = 'Use pelo menos 3 letras (ex.: roupa).';
  }

  const qtd = valores.quantidade.trim();
  if (!qtd) {
    erros.quantidade = 'Informe a quantidade.';
  } else if (!/^\d+$/.test(qtd)) {
    erros.quantidade = 'Use apenas números inteiros.';
  } else if (Number(qtd) <= 0) {
    erros.quantidade = 'A quantidade precisa ser maior que zero.';
  }

  if (!valores.pontoDestino.trim()) {
    erros.pontoDestino = 'Escolha o ponto que vai receber a doação.';
  }

  return erros;
}

export function temErros(erros: object): boolean {
  return Object.keys(erros).length > 0;
}
