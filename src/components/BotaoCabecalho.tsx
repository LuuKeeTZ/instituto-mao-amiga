import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores, espaco, TOQUE_MINIMO } from '../theme';

interface Props {
  titulo: string;
  onPress: () => void;
  rotuloAcessivel?: string;
}

/** Botão de texto para o lado direito do cabeçalho (mínimo 44x44). */
export default function BotaoCabecalho({ titulo, onPress, rotuloAcessivel }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel ?? titulo}
    >
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    minWidth: TOQUE_MINIMO,
    minHeight: TOQUE_MINIMO,
    paddingHorizontal: espaco.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { color: cores.branco, fontSize: 16, fontWeight: '700' },
});
