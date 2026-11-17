import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from '../theme';

/** Faixa vermelha para erros de envio (o formulário continua preenchido). */
export default function AvisoErro({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null;
  return (
    <View style={styles.caixa} accessibilityRole="alert">
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    backgroundColor: cores.erroClaro,
    borderColor: cores.erro,
    borderWidth: 1,
    borderRadius: raio.sm,
    padding: espaco.md,
  },
  texto: { color: cores.erro, fontSize: 14, fontWeight: '600' },
});
