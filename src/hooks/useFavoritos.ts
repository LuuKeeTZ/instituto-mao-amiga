import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Ponto } from '../types/ponto';
import { alternarFavorito, listarFavoritos } from '../storage/favoritosStorage';

/** Ids favoritos (relidos sempre que a tela ganha foco) e a função de marcar/desmarcar. */
export function useFavoritos() {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarFavoritos().then((lista) => ativo && setIds(new Set(lista)));
      return () => {
        ativo = false;
      };
    }, []),
  );

  const alternar = useCallback(async (ponto: Ponto) => {
    // Atualiza a tela na hora e depois grava no aparelho.
    setIds((atual) => {
      const novo = new Set(atual);
      if (novo.has(ponto.id)) novo.delete(ponto.id);
      else novo.add(ponto.id);
      return novo;
    });
    setIds(new Set(await alternarFavorito(ponto.id)));
  }, []);

  return { ids, alternar };
}
