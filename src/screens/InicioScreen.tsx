import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import { TelaProps } from '../navigation/types';
import { cores, espaco, LARGURA_MAXIMA, raio } from '../theme';

export default function InicioScreen({ navigation }: TelaProps<'Inicio'>) {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.boasVindas}>
        <Text style={styles.titulo}>Mão Amiga</Text>
        <Text style={styles.subtitulo}>
          Encontre um ponto perto de você e registre o que você doou.
        </Text>
      </View>

      <View style={styles.acoes}>
        <BotaoAcao titulo="Ver pontos de coleta" onPress={() => navigation.navigate('Pontos')} />
        <BotaoAcao
          titulo="♥ Meus pontos"
          variante="secundario"
          onPress={() => navigation.navigate('MeusPontos')}
        />
        <BotaoAcao
          titulo="Registrar doação"
          variante="secundario"
          onPress={() => navigation.navigate('DoacaoForm')}
        />
        <BotaoAcao
          titulo="Minhas doações"
          variante="secundario"
          onPress={() => navigation.navigate('Historico')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: espaco.lg,
    gap: espaco.xl,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  boasVindas: {
    backgroundColor: cores.primaria,
    borderRadius: raio.md,
    padding: espaco.xl,
    gap: espaco.sm,
  },
  titulo: { fontSize: 28, fontWeight: '800', color: cores.branco },
  subtitulo: { fontSize: 16, color: cores.primariaClara, lineHeight: 22 },
  acoes: { gap: espaco.md },
});
