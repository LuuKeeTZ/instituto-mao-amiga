import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DoacaoItem from '../components/DoacaoItem';
import EstadoMensagem from '../components/EstadoMensagem';
import { TelaProps } from '../navigation/types';
import { listarDoacoes } from '../storage/doacoesStorage';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Doacao } from '../types/doacao';

export default function HistoricoScreen({ navigation }: TelaProps<'Historico'>) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <FlatList
      style={styles.tela}
      data={doacoes}
      keyExtractor={(doacao) => doacao.id}
      contentContainerStyle={styles.lista}
      ItemSeparatorComponent={() => <View style={{ height: espaco.sm }} />}
      renderItem={({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />}
      ListEmptyComponent={
        <EstadoMensagem
          titulo="Você ainda não registrou nenhuma doação."
          descricao="Quando registrar, ela aparece aqui com a data e o ponto de destino."
          acao={{ titulo: 'Registrar a primeira doação', onPress: () => navigation.navigate('DoacaoForm') }}
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
});
