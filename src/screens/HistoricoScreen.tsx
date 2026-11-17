import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import DoacaoItem from '../components/DoacaoItem';
import EstadoMensagem from '../components/EstadoMensagem';
import RodapeLista from '../components/RodapeLista';
import { useListaPaginada } from '../hooks/useListaPaginada';
import { useValorAtrasado } from '../hooks/useValorAtrasado';
import { TelaProps } from '../navigation/types';
import { buscarPaginaDoacoes } from '../services/doacoesService';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Doacao } from '../types/doacao';

export default function HistoricoScreen({ navigation }: TelaProps<'Historico'>) {
  const [texto, setTexto] = useState('');
  const termo = useValorAtrasado(texto.trim());
  // O filtro por tipo de item é feito pela API (GET /doacoes/filtro?filtro=...).
  const lista = useListaPaginada(buscarPaginaDoacoes, termo);
  const { recomecar } = lista;
  const alturaCabecalho = useHeaderHeight();

  // Ao voltar do cadastro (ou da edição/exclusão), busca a página 0 de novo:
  // a API ordena da mais nova para a mais antiga, então a doação nova aparece no topo.
  useFocusEffect(
    useCallback(() => {
      recomecar();
    }, [recomecar]),
  );

  const abrirDetalhe = useCallback(
    (doacao: Doacao) => navigation.navigate('DoacaoDetalhe', { id: doacao.id }),
    [navigation],
  );

  function conteudo() {
    if (lista.itens.length === 0 && lista.carregando === 'primeira') {
      return <EstadoMensagem carregando titulo="Carregando suas doações..." />;
    }
    if (lista.itens.length === 0 && lista.erro) {
      return (
        <EstadoMensagem
          erro
          titulo="Não foi possível carregar o histórico."
          descricao={lista.erro}
          acao={{ titulo: 'Tentar de novo', onPress: recomecar }}
        />
      );
    }
    return (
      <FlatList
        data={lista.itens}
        keyExtractor={(doacao) => doacao.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={lista.carregarMais}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
        ListHeaderComponent={
          lista.total ? (
            <Text style={styles.contagem}>
              {termo ? `${lista.total} doação(ões) com "${termo}"` : `${lista.total} doação(ões) registradas`}
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />}
        ListEmptyComponent={
          termo ? (
            <EstadoMensagem
              titulo={`Nenhuma doação com "${termo}" no tipo de item.`}
              descricao="Confira a grafia ou apague o texto para ver todas."
            />
          ) : (
            <EstadoMensagem
              titulo="Você ainda não registrou nenhuma doação."
              descricao="Quando registrar, ela aparece aqui com a data e o ponto de destino."
              acao={{
                titulo: 'Registrar a primeira doação',
                onPress: () => navigation.navigate('DoacaoForm'),
              }}
            />
          )
        }
        ListFooterComponent={
          <RodapeLista
            carregandoMais={lista.carregando === 'mais'}
            erroMais={lista.erroMais}
            chegouAoFim={lista.chegouAoFim}
            temItens={lista.itens.length > 0}
            textoFim="Essas são todas as doações."
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
          rotulo="Filtrar por tipo de item"
          placeholder="Filtrar por tipo (ex.: roupa)"
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
