import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AvisoErro from '../components/AvisoErro';
import BotaoAcao from '../components/BotaoAcao';
import CampoTexto from '../components/CampoTexto';
import EstadoMensagem from '../components/EstadoMensagem';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import TelaFormulario from '../components/TelaFormulario';
import { TelaProps } from '../navigation/types';
import { ApiErro } from '../services/api';
import { buscarDoacaoPorId, cadastrarDoacao, editarDoacao } from '../services/doacoesService';
import { listarPontos } from '../services/pontosService';
import { cores, espaco } from '../theme';
import { Doacao, DoacaoFormValores, ErrosDoacao } from '../types/doacao';
import { Ponto } from '../types/ponto';
import { avisar } from '../utils/dialogos';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';
import { temErros, validarDoacao } from '../utils/validacaoDoacao';

const VAZIO: DoacaoFormValores = { tipoItem: '', quantidade: '', pontoDestino: '' };

function paraValores(doacao: Doacao): DoacaoFormValores {
  return {
    tipoItem: doacao.tipoItem,
    quantidade: String(doacao.quantidade),
    pontoDestino: doacao.pontoDestino,
  };
}

/**
 * Um formulário só para as duas situações:
 * sem parâmetro é cadastro; com `id` nos parâmetros é edição (os dados vêm da API).
 */
export default function DoacaoFormScreen({ navigation, route }: TelaProps<'DoacaoForm'>) {
  const idEdicao = route.params?.id;
  const [valores, setValores] = useState<DoacaoFormValores>(VAZIO);
  const [carregando, setCarregando] = useState(Boolean(idEdicao));
  const [erroCarga, setErroCarga] = useState<string | null>(null);
  const [erros, setErros] = useState<ErrosDoacao>({});
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [pontos, setPontos] = useState<Ponto[] | null>(null);
  const [erroPontos, setErroPontos] = useState<string | null>(null);

  // Os pontos de destino vêm da API (GET /api/v1/pontos).
  const carregarPontos = useCallback(async () => {
    setErroPontos(null);
    try {
      setPontos(await listarPontos());
    } catch (e) {
      setErroPontos(mensagemDeErro(e));
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  // Na edição, preenche o formulário com a doação atual da API.
  useEffect(() => {
    if (!idEdicao) return;
    buscarDoacaoPorId(idEdicao)
      .then((doacao) => setValores(paraValores(doacao)))
      .catch((e) => setErroCarga(ehNaoEncontrado(e) ? 'Doação não encontrada.' : mensagemDeErro(e)))
      .finally(() => setCarregando(false));
  }, [idEdicao]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: idEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, idEdicao]);

  function alterar(campo: keyof DoacaoFormValores, texto: string) {
    setValores((atual) => ({ ...atual, [campo]: texto }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function salvar() {
    setErroEnvio(null);
    const encontrados = validarDoacao(valores);
    setErros(encontrados);
    if (temErros(encontrados)) return;

    const dados = {
      tipoItem: valores.tipoItem.trim(),
      quantidade: Number(valores.quantidade),
      pontoDestino: valores.pontoDestino,
    };

    setSalvando(true);
    try {
      if (idEdicao) {
        // PUT: a API mantém o id e a data de registro.
        await editarDoacao(idEdicao, dados);
        avisar('Alterações salvas', `${dados.quantidade} × ${dados.tipoItem}.`, () => navigation.goBack());
      } else {
        const nova = await cadastrarDoacao(dados);
        avisar('Doação registrada', `${nova.quantidade} × ${nova.tipoItem} para ${nova.pontoDestino}.`, () =>
          navigation.goBack(),
        );
      }
    } catch (e) {
      // Não finge sucesso: mostra o motivo e mantém o que foi digitado.
      const campos = e instanceof ApiErro ? (e.corpo as { campos?: ErrosDoacao } | null)?.campos : undefined;
      if (campos) setErros(campos);
      const mensagem =
        e instanceof ApiErro && e.status === 400
          ? 'A API recusou a doação. Confira os campos destacados.'
          : mensagemDeErro(e);
      setErroEnvio(mensagem);
      avisar('Não foi possível salvar', mensagem);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <EstadoMensagem carregando titulo="Carregando doação..." />;
  if (erroCarga) return <EstadoMensagem erro titulo="Não foi possível abrir a edição." descricao={erroCarga} />;

  return (
    <TelaFormulario>
      <CampoTexto
        rotulo="O que você vai doar?"
        placeholder="Ex.: roupa, arroz, cobertor"
        value={valores.tipoItem}
        // Duas linhas visíveis: um nome longo quebra a linha em vez de ficar cortado.
        multiline
        numberOfLines={2}
        submitBehavior="blurAndSubmit"
        style={styles.campoLongo}
        onChangeText={(t) => alterar('tipoItem', t.replace(/\n/g, ' '))}
        erro={erros.tipoItem}
      />
      <CampoTexto
        rotulo="Quantidade"
        placeholder="Ex.: 5"
        keyboardType="number-pad"
        value={valores.quantidade}
        onChangeText={(t) => alterar('quantidade', t)}
        erro={erros.quantidade}
      />

      <Text style={styles.rotulo}>Ponto que vai receber</Text>
      {pontos === null && !erroPontos ? <ActivityIndicator color={cores.primaria} /> : null}
      {erroPontos ? (
        <View style={styles.opcoes}>
          <Text style={styles.erro}>Não foi possível carregar os pontos. {erroPontos}</Text>
          <BotaoAcao titulo="Tentar de novo" variante="secundario" onPress={carregarPontos} />
        </View>
      ) : null}
      <View style={styles.opcoes}>
        {(pontos ?? []).map((ponto) => (
          <OpcaoSelecionavel
            key={ponto.id}
            rotulo={ponto.nome}
            selecionada={valores.pontoDestino === ponto.nome}
            onPress={() => alterar('pontoDestino', ponto.nome)}
          />
        ))}
      </View>
      {erros.pontoDestino ? <Text style={styles.erro}>{erros.pontoDestino}</Text> : null}

      <AvisoErro mensagem={erroEnvio} />

      <BotaoAcao
        titulo={idEdicao ? 'Salvar alterações' : 'Registrar doação'}
        onPress={salvar}
        carregando={salvando}
      />
      {idEdicao ? (
        <BotaoAcao titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
      ) : null}
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  erro: { fontSize: 13, color: cores.erro },
  campoLongo: { paddingVertical: espaco.sm, textAlignVertical: 'top' },
});
