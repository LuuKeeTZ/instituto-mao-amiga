import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';

interface Props {
  rotulo: string;
  selecionada: boolean;
  onPress: () => void;
}

/** Botão de escolha única: o selecionado fica preenchido com a cor primária. */
export default function OpcaoSelecionavel({ rotulo, selecionada, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="radio"
      aria-checked={selecionada}
      aria-selected={selecionada}
      accessibilityLabel={rotulo}
      style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
    >
      <Text style={[styles.texto, selecionada && styles.textoSelecionado]}>
        {selecionada ? '✓ ' : ''}
        {rotulo}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opcao: {
    minHeight: TOQUE_MINIMO,
    justifyContent: 'center',
    paddingHorizontal: espaco.md,
    borderRadius: raio.pill,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  opcaoSelecionada: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { fontSize: 15, color: cores.texto },
  textoSelecionado: { color: cores.branco, fontWeight: '700' },
});
