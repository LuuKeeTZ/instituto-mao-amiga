import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PontoCard from '../components/PontoCard';
import { PONTOS_EXEMPLO } from '../data/pontosExemplo';
import { TelaProps } from '../navigation/types';
import { cores, espaco } from '../theme';
import { Ponto } from '../types/ponto';

export default function PontosScreen({ navigation }: TelaProps<'Pontos'>) {
  const abrirDetalhe = useCallback(
    (ponto: Ponto) => navigation.navigate('PontoDetalhe', { id: ponto.id }),
    [navigation],
  );

  return (
    <View style={styles.tela}>
      <FlatList
        data={PONTOS_EXEMPLO}
        keyExtractor={(ponto) => ponto.id}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={{ height: espaco.md }} />}
        ListHeaderComponent={
          <Text style={styles.titulo}>Onde doar e onde buscar ajuda em Goiânia</Text>
        }
        renderItem={({ item }) => <PontoCard ponto={item} onPress={abrirDetalhe} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: espaco.lg },
  titulo: {
    fontSize: 15,
    color: cores.textoSuave,
    marginBottom: espaco.md,
  },
});
