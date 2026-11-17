import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';

type Variante = 'primario' | 'secundario' | 'perigo';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
}

export default function BotaoAcao({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
}: Props) {
  const bloqueado = desabilitado || carregando;
  const corTexto = variante === 'secundario' ? cores.primaria : cores.branco;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={[styles.base, styles[variante], bloqueado && styles.bloqueado]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TOQUE_MINIMO,
    minWidth: TOQUE_MINIMO,
    borderRadius: raio.sm,
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: {
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.primaria,
  },
  perigo: { backgroundColor: cores.erro },
  bloqueado: { opacity: 0.55 },
  texto: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
