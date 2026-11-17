import { StyleSheet, Text, View } from 'react-native';
import { TipoPonto } from '../types/ponto';
import { cores, espaco, raio } from '../theme';

interface Props {
  tipo: TipoPonto;
}

export default function TipoBadge({ tipo }: Props) {
  const ehColeta = tipo === 'coleta';
  return (
    <View style={[styles.badge, ehColeta ? styles.coleta : styles.distribuicao]}>
      <Text style={[styles.texto, { color: ehColeta ? cores.primaria : cores.destaque }]}>
        {ehColeta ? 'Recebe doações' : 'Distribui doações'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: raio.pill,
  },
  coleta: { backgroundColor: cores.primariaClara },
  distribuicao: { backgroundColor: cores.destaqueClaro },
  texto: { fontSize: 12, fontWeight: '700' },
});
