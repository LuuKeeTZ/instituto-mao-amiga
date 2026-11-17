import { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import CampoTexto from '../components/CampoTexto';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import TelaFormulario from '../components/TelaFormulario';
import { PONTOS_EXEMPLO } from '../data/pontosExemplo';
import { TelaProps } from '../navigation/types';
import { atualizarDoacao, salvarDoacao } from '../storage/doacoesStorage';
import { cores, espaco } from '../theme';
import { Doacao, DoacaoFormValores, ErrosDoacao } from '../types/doacao';
import { avisar } from '../utils/dialogos';
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
 * sem parâmetro é cadastro; com `doacao` nos parâmetros é edição.
 */
export default function DoacaoFormScreen({ navigation, route }: TelaProps<'DoacaoForm'>) {
  const emEdicao = route.params?.doacao;
  const [valores, setValores] = useState<DoacaoFormValores>(
    emEdicao ? paraValores(emEdicao) : VAZIO,
  );
  const [erros, setErros] = useState<ErrosDoacao>({});
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: emEdicao ? 'Editar doação' : 'Registrar doação' });
  }, [navigation, emEdicao]);

  function alterar(campo: keyof DoacaoFormValores, texto: string) {
    setValores((atual) => ({ ...atual, [campo]: texto }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function salvar() {
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
      if (emEdicao) {
        const atualizada = await atualizarDoacao({ ...emEdicao, ...dados });
        // Volta ao detalhe já com os valores novos.
        navigation.popTo('DoacaoDetalhe', { doacao: atualizada });
      } else {
        const nova = await salvarDoacao(dados);
        avisar('Doação registrada', `${nova.quantidade} × ${nova.tipoItem} para ${nova.pontoDestino}.`, () =>
          navigation.goBack(),
        );
      }
    } catch {
      avisar('Não foi possível salvar', 'Tente de novo. O que você digitou foi mantido.');
    } finally {
      setSalvando(false);
    }
  }

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
      <View style={styles.opcoes}>
        {PONTOS_EXEMPLO.filter((p) => p.tipo === 'coleta').map((ponto) => (
          <OpcaoSelecionavel
            key={ponto.id}
            rotulo={ponto.nome}
            selecionada={valores.pontoDestino === ponto.nome}
            onPress={() => alterar('pontoDestino', ponto.nome)}
          />
        ))}
      </View>
      {erros.pontoDestino ? <Text style={styles.erro}>{erros.pontoDestino}</Text> : null}

      <BotaoAcao
        titulo={emEdicao ? 'Salvar alterações' : 'Registrar doação'}
        onPress={salvar}
        carregando={salvando}
      />
      {emEdicao ? (
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
