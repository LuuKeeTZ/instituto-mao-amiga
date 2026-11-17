import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TOQUE_MINIMO } from '../theme';

interface Props {
  onPress: () => void;
  cor?: string;
}

/** Seta de voltar do cabeçalho com área de toque de 44x44 (a padrão tinha 30x30 no navegador). */
export default function BotaoVoltar({ onPress, cor = '#fff' }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={4}
    >
      <Text style={[styles.seta, { color: cor }]}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: TOQUE_MINIMO,
    height: TOQUE_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seta: { fontSize: 26, fontWeight: '700' },
});
