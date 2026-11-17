import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../types/doacao';

// Único arquivo do app que conversa com o AsyncStorage sobre doações.
// As telas só chamam estas funções; nenhuma delas conhece a chave nem o JSON.

const CHAVE = '@maoamiga/doacoes';

export type NovaDoacao = Omit<Doacao, 'id' | 'criadoEm'>;

function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function gravarTodas(doacoes: Doacao[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(doacoes));
}

/** Todas as doações salvas, da mais nova para a mais antiga. */
export async function listarDoacoes(): Promise<Doacao[]> {
  const json = await AsyncStorage.getItem(CHAVE);
  if (!json) return [];
  try {
    const lista = JSON.parse(json) as Doacao[];
    return lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  } catch {
    return [];
  }
}

/** Acrescenta uma doação ao histórico, gerando id e data de registro. */
export async function salvarDoacao(dados: NovaDoacao): Promise<Doacao> {
  const doacao: Doacao = { ...dados, id: gerarId(), criadoEm: new Date().toISOString() };
  const atuais = await listarDoacoes();
  await gravarTodas([doacao, ...atuais]);
  return doacao;
}

/** Remove a doação com este id. As outras ficam como estão. */
export async function excluirDoacao(id: string): Promise<void> {
  const atuais = await listarDoacoes();
  await gravarTodas(atuais.filter((d) => d.id !== id));
}
