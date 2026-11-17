import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import EstadoMensagem from '../components/EstadoMensagem';
import TipoBadge from '../components/TipoBadge';
import { TelaProps } from '../navigation/types';
import { buscarPontoPorId, excluirPonto } from '../services/pontosService';
import { cores, espaco, LARGURA_MAXIMA, raio } from '../theme';
import { Ponto } from '../types/ponto';
import { avisar, confirmarExclusao } from '../utils/dialogos';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; ponto: Ponto }
  | { tipo: 'naoEncontrado' }
  | { tipo: 'erro'; mensagem: string };

export default function PontoDetalheScreen({ route, navigation }: TelaProps<'PontoDetalhe'>) {
  const { id } = route.params; // a navegação passa só o id; o resto vem da API
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setEstado({ tipo: 'carregando' });
    try {
      setEstado({ tipo: 'pronto', ponto: await buscarPontoPorId(id) });
    } catch (e) {
      setEstado(ehNaoEncontrado(e) ? { tipo: 'naoEncontrado' } : { tipo: 'erro', mensagem: mensagemDeErro(e) });
    }
  }, [id]);

  // Busca de novo ao voltar da edição, para mostrar os valores novos.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function pedirExclusao(ponto: Ponto) {
    confirmarExclusao('Excluir ponto?', `"${ponto.nome}" será removido para todos.`, async () => {
      setExcluindo(true);
      try {
        await excluirPonto(ponto.id);
        navigation.goBack();
      } catch (e) {
        setExcluindo(false);
        avisar('Não foi possível excluir', mensagemDeErro(e));
      }
    });
  }

  if (estado.tipo === 'carregando') return <EstadoMensagem carregando titulo="Carregando ponto..." />;
  if (estado.tipo === 'naoEncontrado') {
    return (
      <EstadoMensagem
        titulo="Ponto não encontrado."
        descricao="Ele pode ter sido excluído. Volte para a lista e escolha outro."
      />
    );
  }
  if (estado.tipo === 'erro') {
    return (
      <EstadoMensagem
        erro
        titulo="Não foi possível carregar o ponto."
        descricao={estado.mensagem}
        acao={{ titulo: 'Tentar de novo', onPress: carregar }}
      />
    );
  }

  const { ponto } = estado;
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
        <Text style={styles.rotulo}>O que faz</Text>
        <Text style={styles.valor}>
          {ponto.tipo === 'coleta'
            ? 'Recebe doações: leve aqui o que você quer doar.'
            : 'Distribui doações para as famílias atendidas.'}
        </Text>
      </View>

      <View style={styles.acoes}>
        <BotaoAcao titulo="Editar ponto" onPress={() => navigation.navigate('PontoForm', { id: ponto.id })} />
        <BotaoAcao
          titulo="Excluir ponto"
          variante="perigo"
          carregando={excluindo}
          onPress={() => pedirExclusao(ponto)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: espaco.lg,
    gap: espaco.md,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  acoes: { gap: espaco.md, marginTop: espaco.sm },
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
