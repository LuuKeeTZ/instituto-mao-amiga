import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import CampoBusca from '../components/CampoBusca';
import EstadoMensagem from '../components/EstadoMensagem';
import PontoCard from '../components/PontoCard';
import { useValorAtrasado } from '../hooks/useValorAtrasado';
import { TelaProps } from '../navigation/types';
import { buscarPaginaPontos } from '../services/pontosService';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';
import { Ponto } from '../types/ponto';
import { mensagemDeErro } from '../utils/mensagemErro';

/**
 * Controle da paginação guardado em ref (não precisa redesenhar a tela):
 * - `pedidas`: páginas já pedidas para a busca atual, para nunca pedir a mesma duas vezes;
 * - `total`: total de páginas informado pela API, para parar na última;
 * - `geracao`: muda a cada nova busca, para descartar respostas atrasadas da busca anterior.
 */
interface ControlePaginacao {
  termo: string;
  proxima: number;
  total: number;
  pedidas: Set<number>;
  emAndamento: boolean;
  geracao: number;
}

export default function PontosScreen({ navigation }: TelaProps<'Pontos'>) {
  const [texto, setTexto] = useState('');
  const termo = useValorAtrasado(texto.trim());
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [totalPontos, setTotalPontos] = useState<number | null>(null);
  const [carregando, setCarregando] = useState<'primeira' | 'mais' | null>('primeira');
  const [erro, setErro] = useState<string | null>(null);
  const [erroMais, setErroMais] = useState<string | null>(null);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const alturaCabecalho = useHeaderHeight();
  const controle = useRef<ControlePaginacao>({
    termo: '',
    proxima: 0,
    total: Infinity,
    pedidas: new Set(),
    emAndamento: false,
    geracao: 0,
  });

  const carregarPagina = useCallback(async (pagina: number) => {
    const c = controle.current;
    if (c.emAndamento || c.pedidas.has(pagina) || pagina >= c.total) return;
    c.emAndamento = true;
    c.pedidas.add(pagina);
    const geracao = c.geracao;
    setCarregando(pagina === 0 ? 'primeira' : 'mais');
    try {
      const resposta = await buscarPaginaPontos(c.termo, pagina);
      if (geracao !== c.geracao) return;
      c.total = resposta.page.totalPages;
      c.proxima = pagina + 1;
      setTotalPontos(resposta.page.totalElements);
      setChegouAoFim(c.proxima >= c.total);
      setPontos((atuais) => (pagina === 0 ? resposta.content : [...atuais, ...resposta.content]));
      setErro(null);
      setErroMais(null);
    } catch (e) {
      if (geracao !== c.geracao) return;
      c.pedidas.delete(pagina); // falhou: libera para o botão "Tentar de novo"
      if (pagina === 0) setErro(mensagemDeErro(e));
      else setErroMais(mensagemDeErro(e));
    } finally {
      if (geracao === c.geracao) {
        c.emAndamento = false;
        setCarregando(null);
      }
    }
  }, []);

  // Toda busca nova começa do zero, na primeira página.
  const recomecar = useCallback(() => {
    controle.current = {
      termo,
      proxima: 0,
      total: Infinity,
      pedidas: new Set(),
      emAndamento: false,
      geracao: controle.current.geracao + 1,
    };
    setPontos([]);
    setTotalPontos(null);
    setChegouAoFim(false);
    setErro(null);
    setErroMais(null);
    carregarPagina(0);
  }, [termo, carregarPagina]);

  useEffect(() => {
    recomecar();
  }, [recomecar]);

  const abrirDetalhe = useCallback(
    (ponto: Ponto) => navigation.navigate('PontoDetalhe', { id: ponto.id }),
    [navigation],
  );

  function conteudo() {
    if (pontos.length === 0 && carregando === 'primeira') {
      return <EstadoMensagem carregando titulo="Carregando pontos..." />;
    }
    if (pontos.length === 0 && erro) {
      return (
        <EstadoMensagem
          erro
          titulo="Não foi possível carregar os pontos."
          descricao={erro}
          acao={{ titulo: 'Tentar de novo', onPress: recomecar }}
        />
      );
    }
    return (
      <FlatList
        data={pontos}
        keyExtractor={(ponto) => ponto.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={() => carregarPagina(controle.current.proxima)}
        onEndReachedThreshold={0.4}
        ItemSeparatorComponent={() => <View style={{ height: espaco.md }} />}
        ListHeaderComponent={
          totalPontos !== null ? (
            <Text style={styles.contagem}>
              {termo ? `${totalPontos} resultado(s) para "${termo}"` : `${totalPontos} pontos em Goiânia`}
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => <PontoCard ponto={item} onPress={abrirDetalhe} />}
        ListEmptyComponent={
          <EstadoMensagem
            titulo={termo ? `Nenhum ponto encontrado para "${termo}".` : 'Nenhum ponto cadastrado ainda.'}
            descricao={termo ? 'A busca procura no nome e no bairro.' : undefined}
          />
        }
        ListFooterComponent={
          <View style={styles.rodape}>
            {carregando === 'mais' ? <ActivityIndicator color={cores.primaria} /> : null}
            {erroMais ? (
              <>
                <Text style={styles.erro}>{erroMais}</Text>
                <BotaoAcao
                  titulo="Tentar de novo"
                  variante="secundario"
                  onPress={() => carregarPagina(controle.current.proxima)}
                />
              </>
            ) : null}
            {chegouAoFim && pontos.length > 0 ? (
              <Text style={styles.fim}>Esses são todos os pontos.</Text>
            ) : null}
          </View>
        }
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={alturaCabecalho}
    >
      <View style={styles.topo}>
        <CampoBusca
          valor={texto}
          onChange={setTexto}
          rotulo="Buscar ponto por nome ou bairro"
          placeholder="Buscar por nome ou bairro"
        />
      </View>
      {conteudo()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  topo: {
    paddingHorizontal: espaco.lg,
    paddingTop: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  lista: {
    padding: espaco.lg,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexGrow: 1,
  },
  contagem: { fontSize: 14, color: cores.textoSuave, marginBottom: espaco.md },
  rodape: { paddingVertical: espaco.lg, gap: espaco.sm, alignItems: 'stretch' },
  erro: { fontSize: 14, color: cores.erro, textAlign: 'center' },
  fim: { fontSize: 13, color: cores.textoSuave, textAlign: 'center' },
});
