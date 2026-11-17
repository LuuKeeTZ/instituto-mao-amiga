import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AvisoErro from '../components/AvisoErro';
import BotaoAcao from '../components/BotaoAcao';
import CampoTexto from '../components/CampoTexto';
import EstadoMensagem from '../components/EstadoMensagem';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import TelaFormulario from '../components/TelaFormulario';
import { TelaProps } from '../navigation/types';
import { ApiErro } from '../services/api';
import { buscarPontoPorId, cadastrarPonto, editarPonto } from '../services/pontosService';
import { cores, espaco } from '../theme';
import { PontoDados, TipoPonto } from '../types/ponto';
import { avisar } from '../utils/dialogos';
import { ehNaoEncontrado, mensagemDeErro } from '../utils/mensagemErro';
import { ErrosPonto, validarPonto } from '../utils/validacaoPonto';

const VAZIO: PontoDados = { nome: '', endereco: '', bairro: '', horario: '', tipo: '' as TipoPonto };
const TIPOS: { valor: TipoPonto; rotulo: string }[] = [
  { valor: 'coleta', rotulo: 'Coleta (recebe doações)' },
  { valor: 'distribuição', rotulo: 'Distribuição (entrega doações)' },
];

/** Mesmo formulário para cadastrar (sem id) e editar (com id nos parâmetros). */
export default function PontoFormScreen({ navigation, route }: TelaProps<'PontoForm'>) {
  const idEdicao = route.params?.id;
  const [dados, setDados] = useState<PontoDados>(VAZIO);
  const [erros, setErros] = useState<ErrosPonto>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(Boolean(idEdicao));
  const [erroCarga, setErroCarga] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: idEdicao ? 'Editar ponto' : 'Cadastrar ponto' });
  }, [navigation, idEdicao]);

  // Na edição, preenche o formulário com o ponto atual da API.
  useEffect(() => {
    if (!idEdicao) return;
    buscarPontoPorId(idEdicao)
      .then(({ id: _id, ...resto }) => setDados(resto))
      .catch((e) =>
        setErroCarga(ehNaoEncontrado(e) ? 'Ponto não encontrado.' : mensagemDeErro(e)),
      )
      .finally(() => setCarregando(false));
  }, [idEdicao]);

  function alterar(campo: keyof PontoDados, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function salvar() {
    setErroEnvio(null);
    const encontrados = validarPonto(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;

    const limpos: PontoDados = {
      nome: dados.nome.trim(),
      endereco: dados.endereco.trim(),
      bairro: dados.bairro.trim(),
      horario: dados.horario.trim(),
      tipo: dados.tipo,
    };
    setSalvando(true);
    try {
      if (idEdicao) {
        await editarPonto(idEdicao, limpos);
        avisar('Alterações salvas', limpos.nome, () => navigation.goBack());
      } else {
        const criado = await cadastrarPonto(limpos);
        avisar('Ponto cadastrado', criado.nome, () => navigation.goBack());
      }
    } catch (e) {
      // Não finge sucesso: mostra o motivo e deixa tudo o que foi digitado no lugar.
      const campos = e instanceof ApiErro ? (e.corpo as { campos?: ErrosPonto } | null)?.campos : undefined;
      if (campos) setErros(campos);
      const mensagem =
        e instanceof ApiErro && e.status === 400
          ? 'A API recusou os dados. Confira os campos destacados.'
          : mensagemDeErro(e);
      setErroEnvio(mensagem);
      avisar('Não foi possível salvar', mensagem);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <EstadoMensagem carregando titulo="Carregando ponto..." />;
  if (erroCarga) return <EstadoMensagem erro titulo="Não foi possível abrir a edição." descricao={erroCarga} />;

  return (
    <TelaFormulario>
      <CampoTexto
        rotulo="Nome do ponto"
        placeholder="Ex.: Casa Solidária Vila Nova"
        value={dados.nome}
        onChangeText={(t) => alterar('nome', t)}
        erro={erros.nome}
      />
      <CampoTexto
        rotulo="Endereço"
        placeholder="Ex.: Rua 214, nº 120"
        value={dados.endereco}
        onChangeText={(t) => alterar('endereco', t)}
        erro={erros.endereco}
      />
      <CampoTexto
        rotulo="Bairro"
        placeholder="Ex.: Vila Nova"
        value={dados.bairro}
        onChangeText={(t) => alterar('bairro', t)}
        erro={erros.bairro}
      />
      <CampoTexto
        rotulo="Dias e horários"
        placeholder="Ex.: Seg a Sex, 8h às 17h"
        value={dados.horario}
        onChangeText={(t) => alterar('horario', t)}
        erro={erros.horario}
      />

      <Text style={styles.rotulo}>Tipo</Text>
      <View style={styles.opcoes}>
        {TIPOS.map((t) => (
          <OpcaoSelecionavel
            key={t.valor}
            rotulo={t.rotulo}
            selecionada={dados.tipo === t.valor}
            onPress={() => alterar('tipo', t.valor)}
          />
        ))}
      </View>
      {erros.tipo ? <Text style={styles.erro}>{erros.tipo}</Text> : null}

      <AvisoErro mensagem={erroEnvio} />

      <BotaoAcao
        titulo={idEdicao ? 'Salvar alterações' : 'Cadastrar ponto'}
        onPress={salvar}
        carregando={salvando}
      />
      <BotaoAcao titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  erro: { fontSize: 13, color: cores.erro },
});
