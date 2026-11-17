import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import { TelaProps } from '../navigation/types';
import { excluirDoacao } from '../storage/doacoesStorage';
import { cores, espaco, LARGURA_MAXIMA, raio } from '../theme';
import { avisar, confirmarExclusao } from '../utils/dialogos';
import { formatarDataHora } from '../utils/formatarData';

export default function DoacaoDetalheScreen({ route, navigation }: TelaProps<'DoacaoDetalhe'>) {
  const { doacao } = route.params;
  const [excluindo, setExcluindo] = useState(false);

  function pedirExclusao() {
    confirmarExclusao(
      'Excluir doação?',
      `${doacao.quantidade} × ${doacao.tipoItem} para ${doacao.pontoDestino} será apagada deste aparelho.`,
      async () => {
        setExcluindo(true);
        try {
          await excluirDoacao(doacao.id);
          navigation.goBack();
        } catch {
          setExcluindo(false);
          avisar('Não foi possível excluir', 'Tente de novo.');
        }
      },
    );
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.cartao}>
        <Linha rotulo="Tipo de item" valor={doacao.tipoItem} />
        <Linha rotulo="Quantidade" valor={`${doacao.quantidade} unidade(s)`} />
        <Linha rotulo="Ponto de destino" valor={doacao.pontoDestino} />
        <Linha rotulo="Registrada em" valor={formatarDataHora(doacao.criadoEm)} />
      </View>

      <BotaoAcao titulo="Excluir doação" variante="perigo" onPress={pedirExclusao} carregando={excluindo} />
    </ScrollView>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: espaco.lg,
    gap: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.lg,
    gap: espaco.md,
  },
  linha: { gap: 2 },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.textoSuave,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: { fontSize: 17, color: cores.texto },
});
