import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
}

export default function CampoTexto({ rotulo, erro, style, ...resto }: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        placeholderTextColor={cores.textoSuave}
        accessibilityLabel={rotulo}
        style={[styles.entrada, erro ? styles.entradaErro : null, style]}
        {...resto}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { gap: espaco.xs },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  entrada: {
    minHeight: TOQUE_MINIMO,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.sm,
    backgroundColor: cores.superficie,
    paddingHorizontal: espaco.md,
    fontSize: 16,
    color: cores.texto,
  },
  entradaErro: { borderColor: cores.erro, backgroundColor: cores.erroClaro },
  erro: { fontSize: 13, color: cores.erro },
});
