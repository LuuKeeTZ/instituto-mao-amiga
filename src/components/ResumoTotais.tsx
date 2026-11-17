import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, raio } from '../theme';
import { Doacao } from '../types/doacao';
import { calcularResumo } from '../utils/totais';

interface Props {
  doacoes: Doacao[];
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export default function ResumoTotais({ doacoes }: Props) {
  const resumo = calcularResumo(doacoes);

  if (resumo.totalDoacoes === 0) {
    return (
      <View style={styles.caixa}>
        <Text style={styles.titulo}>Resumo</Text>
        <Text style={styles.linha}>Ainda não há totais: nenhuma doação registrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.caixa} accessibilityLabel="Resumo das doações">
      <Text style={styles.titulo}>
        {plural(resumo.totalDoacoes, 'doação', 'doações')} ·{' '}
        {plural(resumo.totalUnidades, 'unidade', 'unidades')}
      </Text>
      {resumo.porTipo.map((t) => (
        <View key={t.tipo.toLowerCase()} style={styles.tipo}>
          <Text style={styles.nomeTipo}>{t.tipo}</Text>
          <Text style={styles.linha}>
            {plural(t.unidades, 'unidade', 'unidades')} em {plural(t.doacoes, 'doação', 'doações')}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    backgroundColor: cores.primariaClara,
    borderRadius: raio.md,
    padding: espaco.md,
    gap: espaco.xs,
    marginBottom: espaco.md,
  },
  titulo: { fontSize: 16, fontWeight: '800', color: cores.primaria, marginBottom: espaco.xs },
  tipo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: espaco.sm,
  },
  nomeTipo: { fontSize: 15, fontWeight: '700', color: cores.texto, textTransform: 'capitalize' },
  linha: { fontSize: 14, color: cores.texto },
});
