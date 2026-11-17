import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../theme';
import BotaoAcao from './BotaoAcao';

interface Props {
  titulo: string;
  descricao?: string;
  carregando?: boolean;
  erro?: boolean;
  acao?: { titulo: string; onPress: () => void };
}

/** Mensagem centralizada para os estados de carregando, erro e lista vazia. */
export default function EstadoMensagem({ titulo, descricao, carregando, erro, acao }: Props) {
  return (
    <View style={styles.caixa}>
      {carregando ? <ActivityIndicator size="large" color={cores.primaria} /> : null}
      <Text style={[styles.titulo, erro && { color: cores.erro }]}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      {acao ? <BotaoAcao titulo={acao.titulo} onPress={acao.onPress} variante="secundario" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.xl,
    gap: espaco.md,
  },
  titulo: { fontSize: 17, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  descricao: { fontSize: 15, color: cores.textoSuave, textAlign: 'center' },
});
