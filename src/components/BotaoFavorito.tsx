import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores, TOQUE_MINIMO } from '../theme';

interface Props {
  ativo: boolean;
  nomePonto: string;
  onPress: () => void;
}

/** Coração ♡/♥ com área de toque de 44x44. */
export default function BotaoFavorito({ ativo, nomePonto, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.botao}
      accessibilityRole="button"
      accessibilityLabel={ativo ? `Remover ${nomePonto} dos favoritos` : `Favoritar ${nomePonto}`}
      aria-pressed={ativo}
    >
      <Text style={[styles.coracao, ativo && styles.ativo]}>{ativo ? '♥' : '♡'}</Text>
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
  coracao: { fontSize: 26, color: cores.textoSuave },
  ativo: { color: cores.destaque },
});
