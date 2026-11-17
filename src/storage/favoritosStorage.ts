import AsyncStorage from '@react-native-async-storage/async-storage';

// Favoritos ficam só no aparelho: é uma preferência de quem usa o celular,
// não um dado do Instituto. Guardamos apenas os ids; os dados do ponto
// sempre vêm da API, então nunca ficam desatualizados.

const CHAVE = '@maoamiga/pontos-favoritos';

export async function listarFavoritos(): Promise<string[]> {
  const json = await AsyncStorage.getItem(CHAVE);
  if (!json) return [];
  try {
    const ids = JSON.parse(json);
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

async function gravar(ids: string[]): Promise<string[]> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ids));
  return ids;
}

/** Marca ou desmarca o ponto e devolve a lista de ids atualizada. */
export async function alternarFavorito(id: string): Promise<string[]> {
  const atuais = await listarFavoritos();
  return gravar(atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id]);
}

export async function removerFavoritos(ids: string[]): Promise<string[]> {
  const atuais = await listarFavoritos();
  return gravar(atuais.filter((x) => !ids.includes(x)));
}
