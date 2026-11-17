import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';
import { Doacao } from '../types/doacao';
import { formatarDataHora } from '../utils/formatarData';

interface Props {
  doacao: Doacao;
  onPress?: (doacao: Doacao) => void;
}

// memo: o item só renderiza de novo quando a própria doação muda,
// e não a cada atualização da lista inteira.
function DoacaoItem({ doacao, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.75}
      disabled={!onPress}
      onPress={() => onPress?.(doacao)}
      accessibilityRole="button"
      accessibilityLabel={`Doação de ${doacao.quantidade} ${doacao.tipoItem}`}
    >
      <View style={styles.quantidade}>
        <Text style={styles.numero}>{doacao.quantidade}</Text>
        <Text style={styles.un}>un.</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.tipo}>{doacao.tipoItem}</Text>
        <Text style={styles.destino}>para {doacao.pontoDestino}</Text>
        <Text style={styles.data}>{formatarDataHora(doacao.criadoEm)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(DoacaoItem);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.md,
    minHeight: TOQUE_MINIMO,
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  quantidade: {
    minWidth: 56,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.xs,
    borderRadius: raio.sm,
    backgroundColor: cores.destaqueClaro,
    alignItems: 'center',
  },
  numero: { fontSize: 20, fontWeight: '800', color: cores.destaque },
  un: { fontSize: 11, color: cores.destaque },
  info: { flex: 1, gap: 2 },
  tipo: { fontSize: 17, fontWeight: '700', color: cores.texto, textTransform: 'capitalize' },
  destino: { fontSize: 14, color: cores.texto },
  data: { fontSize: 12, color: cores.textoSuave },
});
