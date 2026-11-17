import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import CampoBusca from '../components/CampoBusca';
import DoacaoItem from '../components/DoacaoItem';
import EstadoMensagem from '../components/EstadoMensagem';
import { TelaProps } from '../navigation/types';
import { listarDoacoes } from '../storage/doacoesStorage';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Doacao } from '../types/doacao';

function contemTexto(doacao: Doacao, busca: string): boolean {
  return doacao.tipoItem.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'));
}

export default function HistoricoScreen({ navigation }: TelaProps<'Historico'>) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const alturaCabecalho = useHeaderHeight();

  const abrirDetalhe = useCallback(
    (doacao: Doacao) => navigation.navigate('DoacaoDetalhe', { doacao }),
    [navigation],
  );

  // Relê o armazenamento sempre que a tela volta a ficar visível,
  // assim uma doação recém-registrada aparece sem fechar o app.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarDoacoes().then((lista) => {
        if (ativo) {
          setDoacoes(lista);
          setCarregando(false);
        }
      });
      return () => {
        ativo = false;
      };
    }, []),
  );

  if (carregando) {
    return <EstadoMensagem carregando titulo="Carregando suas doações..." />;
  }

  // Calculada a cada render a partir do texto e do array completo:
  // não existe um segundo estado com a lista filtrada.
  const termo = busca.trim();
  const visiveis = termo ? doacoes.filter((d) => contemTexto(d, termo)) : doacoes;

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={alturaCabecalho}
    >
      {doacoes.length > 0 ? (
        <View style={styles.topo}>
          <CampoBusca
            valor={busca}
            onChange={setBusca}
            rotulo="Filtrar por tipo de item"
            placeholder="Filtrar por tipo (ex.: roupa)"
          />
        </View>
      ) : null}

      <FlatList
        data={visiveis}
        keyExtractor={(doacao) => doacao.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
        renderItem={({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />}
        ListEmptyComponent={
          doacoes.length === 0 ? (
            <EstadoMensagem
              titulo="Você ainda não registrou nenhuma doação."
              descricao="Quando registrar, ela aparece aqui com a data e o ponto de destino."
              acao={{
                titulo: 'Registrar a primeira doação',
                onPress: () => navigation.navigate('DoacaoForm'),
              }}
            />
          ) : (
            <EstadoMensagem
              titulo={`Nenhuma doação com "${termo}" no tipo de item.`}
              descricao="Confira a grafia ou apague o texto para ver todas."
            />
          )
        }
      />
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
});
