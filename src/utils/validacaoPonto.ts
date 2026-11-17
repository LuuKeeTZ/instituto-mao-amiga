import { PontoDados } from '../types/ponto';

export type ErrosPonto = Partial<Record<keyof PontoDados, string>>;

const ROTULOS: Record<keyof PontoDados, string> = {
  nome: 'o nome',
  endereco: 'o endereço',
  bairro: 'o bairro',
  horario: 'os dias e horários',
  tipo: 'se o ponto é de coleta ou de distribuição',
};

/** Nenhum campo pode ficar vazio (mesma regra da API). */
export function validarPonto(dados: PontoDados): ErrosPonto {
  const erros: ErrosPonto = {};
  (Object.keys(ROTULOS) as (keyof PontoDados)[]).forEach((campo) => {
    if (!String(dados[campo] ?? '').trim()) erros[campo] = `Informe ${ROTULOS[campo]}.`;
  });
  return erros;
}
