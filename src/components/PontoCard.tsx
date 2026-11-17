import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ponto } from '../types/ponto';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';
import TipoBadge from './TipoBadge';

interface Props {
  ponto: Ponto;
  onPress?: (ponto: Ponto) => void;
}

function PontoCard({ ponto, onPress }: Props) {
  const faixa = ponto.tipo === 'coleta' ? cores.primaria : cores.destaque;
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      disabled={!onPress}
      onPress={() => onPress?.(ponto)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${ponto.nome}`}
    >
      <View style={[styles.faixa, { backgroundColor: faixa }]} />
      <View style={styles.conteudo}>
        <TipoBadge tipo={ponto.tipo} />
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.linha}>{ponto.bairro}</Text>
        <Text style={styles.linhaSuave}>{ponto.horario}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(PontoCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    minHeight: TOQUE_MINIMO,
    overflow: 'hidden',
  },
  faixa: { width: 6 },
  conteudo: { flex: 1, padding: espaco.md, gap: espaco.xs },
  nome: { fontSize: 17, fontWeight: '700', color: cores.texto },
  linha: { fontSize: 14, color: cores.texto },
  linhaSuave: { fontSize: 13, color: cores.textoSuave },
});
