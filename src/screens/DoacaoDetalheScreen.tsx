import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import EstadoMensagem from '../components/EstadoMensagem';
import { TelaProps } from '../navigation/types';
import { buscarDoacaoPorId, excluirDoacao } from '../services/doacoesService';
import { cores, espaco, LARGURA_MAXIMA, raio } from '../theme';
import { Doacao } from '../types/doacao';
import { avisar, confirmarExclusao } from '../utils/dialogos';
import { formatarDataHora } from '../utils/formatarData';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; doacao: Doacao }
  | { tipo: 'naoEncontrada' }
  | { tipo: 'erro'; mensagem: string };

export default function DoacaoDetalheScreen({ route, navigation }: TelaProps<'DoacaoDetalhe'>) {
  const { id } = route.params; // só o id vem pela navegação; os dados vêm da API
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setEstado({ tipo: 'carregando' });
    try {
      setEstado({ tipo: 'pronto', doacao: await buscarDoacaoPorId(id) });
    } catch (e) {
      setEstado(ehNaoEncontrado(e) ? { tipo: 'naoEncontrada' } : { tipo: 'erro', mensagem: mensagemDeErro(e) });
    }
  }, [id]);

  // Busca de novo ao voltar da edição, para mostrar os valores salvos.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function pedirExclusao(doacao: Doacao) {
    confirmarExclusao(
      'Excluir doação?',
      `${doacao.quantidade} × ${doacao.tipoItem} para ${doacao.pontoDestino} será apagada do histórico.`,
      async () => {
        setExcluindo(true);
        try {
          await excluirDoacao(doacao.id);
          navigation.goBack(); // o histórico recarrega ao voltar e a doação some
        } catch (e) {
          setExcluindo(false);
          avisar('Não foi possível excluir', mensagemDeErro(e));
        }
      },
    );
  }

  if (estado.tipo === 'carregando') return <EstadoMensagem carregando titulo="Carregando doação..." />;
  if (estado.tipo === 'naoEncontrada') {
    return (
      <EstadoMensagem
        titulo="Doação não encontrada."
        descricao="Ela pode ter sido excluída. Volte para o histórico."
      />
    );
  }
  if (estado.tipo === 'erro') {
    return (
      <EstadoMensagem
        erro
        titulo="Não foi possível carregar a doação."
        descricao={estado.mensagem}
        acao={{ titulo: 'Tentar de novo', onPress: carregar }}
      />
    );
  }

  const { doacao } = estado;
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.cartao}>
        <Linha rotulo="Tipo de item" valor={doacao.tipoItem} />
        <Linha rotulo="Quantidade" valor={`${doacao.quantidade} unidade(s)`} />
        <Linha rotulo="Ponto de destino" valor={doacao.pontoDestino} />
        <Linha rotulo="Registrada em" valor={formatarDataHora(doacao.criadoEm)} />
      </View>

      <View style={styles.acoes}>
        <BotaoAcao
          titulo="Editar doação"
          onPress={() => navigation.navigate('DoacaoForm', { id: doacao.id })}
        />
        <BotaoAcao
          titulo="Excluir doação"
          variante="perigo"
          onPress={() => pedirExclusao(doacao)}
          carregando={excluindo}
        />
      </View>
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
  acoes: { gap: espaco.md },
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
