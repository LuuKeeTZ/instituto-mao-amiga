import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import BotaoCabecalho from '../components/BotaoCabecalho';
import CampoBusca from '../components/CampoBusca';
import EstadoMensagem from '../components/EstadoMensagem';
import PontoCard from '../components/PontoCard';
import RodapeLista from '../components/RodapeLista';
import { useListaPaginada } from '../hooks/useListaPaginada';
import { useValorAtrasado } from '../hooks/useValorAtrasado';
import { TelaProps } from '../navigation/types';
import { buscarPaginaPontos } from '../services/pontosService';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Ponto } from '../types/ponto';

export default function PontosScreen({ navigation }: TelaProps<'Pontos'>) {
  const [texto, setTexto] = useState('');
  const termo = useValorAtrasado(texto.trim());
  const lista = useListaPaginada(buscarPaginaPontos, termo);
  const { recomecar } = lista;
  const alturaCabecalho = useHeaderHeight();

  // Recarrega ao abrir, a cada busca nova e ao voltar de outra tela
  // (assim um ponto cadastrado, editado ou excluído já aparece certo na lista).
  useFocusEffect(
    useCallback(() => {
      recomecar();
    }, [recomecar]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BotaoCabecalho
          titulo="+ Novo"
          rotuloAcessivel="Cadastrar novo ponto"
          onPress={() => navigation.navigate('PontoForm')}
        />
      ),
    });
  }, [navigation]);

  const abrirDetalhe = useCallback(
    (ponto: Ponto) => navigation.navigate('PontoDetalhe', { id: ponto.id }),
    [navigation],
  );

  function conteudo() {
    if (lista.itens.length === 0 && lista.carregando === 'primeira') {
      return <EstadoMensagem carregando titulo="Carregando pontos..." />;
    }
    if (lista.itens.length === 0 && lista.erro) {
      return (
        <EstadoMensagem
          erro
          titulo="Não foi possível carregar os pontos."
          descricao={lista.erro}
          acao={{ titulo: 'Tentar de novo', onPress: recomecar }}
        />
      );
    }
    return (
      <FlatList
        data={lista.itens}
        keyExtractor={(ponto) => ponto.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={lista.carregarMais}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <View style={{ height: espaco.md }} />}
        ListHeaderComponent={
          lista.total !== null ? (
            <Text style={styles.contagem}>
              {termo ? `${lista.total} resultado(s) para "${termo}"` : `${lista.total} pontos em Goiânia`}
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => <PontoCard ponto={item} onPress={abrirDetalhe} />}
        ListEmptyComponent={
          <EstadoMensagem
            titulo={termo ? `Nenhum ponto encontrado para "${termo}".` : 'Nenhum ponto cadastrado ainda.'}
            descricao={termo ? 'A busca procura no nome e no bairro.' : undefined}
          />
        }
        ListFooterComponent={
          <RodapeLista
            carregandoMais={lista.carregando === 'mais'}
            erroMais={lista.erroMais}
            chegouAoFim={lista.chegouAoFim}
            temItens={lista.itens.length > 0}
            textoFim="Esses são todos os pontos."
            onTentarDeNovo={lista.carregarMais}
          />
        }
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={alturaCabecalho}
    >
      <View style={styles.topo}>
        <CampoBusca
          valor={texto}
          onChange={setTexto}
          rotulo="Buscar ponto por nome ou bairro"
          placeholder="Buscar por nome ou bairro"
        />
      </View>
      {conteudo()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  topo: {
    paddingHorizontal: espaco.lg,
    paddingTop: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  lista: {
    padding: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexGrow: 1,
  },
  contagem: { fontSize: 14, color: cores.textoSuave, marginBottom: espaco.md },
});
