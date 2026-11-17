import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TipoBadge from '../components/TipoBadge';
import { Ponto } from '../types/ponto';
import { cores, espaco, raio } from '../theme';

interface Props {
  ponto: Ponto;
}

export default function PontoDetalheScreen({ ponto }: Props) {
  const rotuloItens = ponto.tipo === 'coleta' ? 'Aceita' : 'Entrega';
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <TipoBadge tipo={ponto.tipo} />
      <Text style={styles.nome}>{ponto.nome}</Text>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Endereço</Text>
        <Text style={styles.valor}>{ponto.endereco}</Text>
        <Text style={styles.valor}>{ponto.bairro} · Goiânia</Text>
      </View>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Dias e horários</Text>
        <Text style={styles.valor}>{ponto.horario}</Text>
      </View>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>{rotuloItens}</Text>
        {ponto.itens.map((item) => (
          <Text key={item} style={styles.valor}>
            • {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.lg, gap: espaco.md },
  nome: { fontSize: 22, fontWeight: '800', color: cores.texto },
  bloco: {
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.md,
    gap: espaco.xs,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.textoSuave,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: { fontSize: 16, color: cores.texto },
});
