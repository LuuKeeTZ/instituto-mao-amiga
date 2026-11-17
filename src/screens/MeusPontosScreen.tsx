import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import EstadoMensagem from '../components/EstadoMensagem';
import PontoCard from '../components/PontoCard';
import { TelaProps } from '../navigation/types';
import { buscarPontoPorId } from '../services/pontosService';
import { alternarFavorito, listarFavoritos, removerFavoritos } from '../storage/favoritosStorage';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Ponto } from '../types/ponto';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; pontos: Ponto[]; falhas: number }
  | { tipo: 'erro'; mensagem: string };

export default function MeusPontosScreen({ navigation }: TelaProps<'MeusPontos'>) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });

  // Lê os ids salvos no aparelho e busca cada ponto na API pelo id.
  const carregar = useCallback(async () => {
    setEstado({ tipo: 'carregando' });
    const ids = await listarFavoritos();
    const resultados = await Promise.allSettled(ids.map((id) => buscarPontoPorId(id)));

    const pontos: Ponto[] = [];
    const excluidos: string[] = [];
    let falhas = 0;
    let ultimoErro: unknown = null;
    resultados.forEach((r, i) => {
      if (r.status === 'fulfilled') pontos.push(r.value);
      else if (ehNaoEncontrado(r.reason)) excluidos.push(ids[i]);
      else {
        falhas += 1;
        ultimoErro = r.reason;
      }
    });

    // Ponto que não existe mais na API fica de fora e sai dos favoritos.
    if (excluidos.length) await removerFavoritos(excluidos);

    if (falhas > 0 && pontos.length === 0) {
      setEstado({ tipo: 'erro', mensagem: mensagemDeErro(ultimoErro) });
    } else {
      setEstado({ tipo: 'pronto', pontos, falhas });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const desmarcar = useCallback(async (ponto: Ponto) => {
    // Some da tela na hora e o id sai dos favoritos salvos no aparelho.
    setEstado((atual) =>
      atual.tipo === 'pronto'
        ? { ...atual, pontos: atual.pontos.filter((p) => p.id !== ponto.id) }
        : atual,
    );
    await alternarFavorito(ponto.id);
  }, []);

  const abrirDetalhe = useCallback(
    (ponto: Ponto) => navigation.navigate('PontoDetalhe', { id: ponto.id }),
    [navigation],
  );

  if (estado.tipo === 'carregando') return <EstadoMensagem carregando titulo="Carregando seus pontos..." />;
  if (estado.tipo === 'erro') {
    return (
      <EstadoMensagem
        erro
        titulo="Não foi possível carregar seus pontos."
        descricao={estado.mensagem}
        acao={{ titulo: 'Tentar de novo', onPress: carregar }}
      />
    );
  }

  return (
    <FlatList
      style={styles.tela}
      data={estado.pontos}
      keyExtractor={(p) => p.id}
      contentContainerStyle={styles.lista}
      ItemSeparatorComponent={() => <View style={{ height: espaco.md }} />}
      ListHeaderComponent={
        estado.falhas > 0 ? (
          <Text style={styles.aviso}>
            {estado.falhas} ponto(s) não puderam ser carregados agora. Tente de novo mais tarde.
          </Text>
        ) : undefined
      }
      renderItem={({ item }) => (
        <PontoCard ponto={item} onPress={abrirDetalhe} favorito onAlternarFavorito={desmarcar} />
      )}
      ListEmptyComponent={
        <EstadoMensagem
          titulo="Você ainda não tem pontos favoritos."
          descricao="Toque no ♡ de um ponto na lista para guardá-lo aqui."
          acao={{ titulo: 'Ver pontos de coleta', onPress: () => navigation.navigate('Pontos') }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: {
    padding: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexGrow: 1,
  },
  aviso: { color: cores.erro, fontSize: 14, marginBottom: espaco.md },
});
