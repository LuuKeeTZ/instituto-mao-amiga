import { FlatList, StyleSheet, Text, View } from 'react-native';
import PontoCard from '../components/PontoCard';
import { PONTOS_EXEMPLO } from '../data/pontosExemplo';
import { cores, espaco } from '../theme';

export default function PontosScreen() {
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
        renderItem={({ item }) => <PontoCard ponto={item} />}
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
