import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EstadoMensagem from '../components/EstadoMensagem';
import TipoBadge from '../components/TipoBadge';
import { TelaProps } from '../navigation/types';
import { buscarPontoPorId } from '../services/pontosService';
import { cores, espaco, LARGURA_MAXIMA, raio } from '../theme';
import { Ponto } from '../types/ponto';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'pronto'; ponto: Ponto }
  | { tipo: 'naoEncontrado' }
  | { tipo: 'erro'; mensagem: string };

export default function PontoDetalheScreen({ route }: TelaProps<'PontoDetalhe'>) {
  const { id } = route.params; // a navegação passa só o id; o resto vem da API
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });

  const carregar = useCallback(async () => {
    setEstado({ tipo: 'carregando' });
    try {
      setEstado({ tipo: 'pronto', ponto: await buscarPontoPorId(id) });
    } catch (e) {
      setEstado(ehNaoEncontrado(e) ? { tipo: 'naoEncontrado' } : { tipo: 'erro', mensagem: mensagemDeErro(e) });
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

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
