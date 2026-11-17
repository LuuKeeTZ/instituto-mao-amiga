import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import CampoTexto from '../components/CampoTexto';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import TelaFormulario from '../components/TelaFormulario';
import { PONTOS_EXEMPLO } from '../data/pontosExemplo';
import { listarDoacoes, salvarDoacao } from '../storage/doacoesStorage';
import { cores, espaco, raio } from '../theme';
import { DoacaoFormValores, ErrosDoacao } from '../types/doacao';
import { avisar } from '../utils/dialogos';
import { temErros, validarDoacao } from '../utils/validacaoDoacao';

const VAZIO: DoacaoFormValores = { tipoItem: '', quantidade: '', pontoDestino: '' };

export default function DoacaoFormScreen() {
  const [valores, setValores] = useState<DoacaoFormValores>(VAZIO);
  const [erros, setErros] = useState<ErrosDoacao>({});
  const [salvando, setSalvando] = useState(false);
  const [totalSalvas, setTotalSalvas] = useState(0);

  useEffect(() => {
    listarDoacoes().then((lista) => setTotalSalvas(lista.length));
  }, []);

  function alterar(campo: keyof DoacaoFormValores, texto: string) {
    setValores((atual) => ({ ...atual, [campo]: texto }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function registrar() {
    const encontrados = validarDoacao(valores);
    setErros(encontrados);
    if (temErros(encontrados)) return;

    setSalvando(true);
    try {
      const doacao = await salvarDoacao({
        tipoItem: valores.tipoItem.trim(),
        quantidade: Number(valores.quantidade),
        pontoDestino: valores.pontoDestino,
      });
      setTotalSalvas((n) => n + 1);
      setValores(VAZIO);
      avisar('Doação registrada', `${doacao.quantidade} × ${doacao.tipoItem} para ${doacao.pontoDestino}.`);
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
        onChangeText={(t) => alterar('tipoItem', t)}
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

      <BotaoAcao titulo="Registrar doação" onPress={registrar} carregando={salvando} />

      {totalSalvas > 0 ? (
        <View style={styles.contador}>
          <Text style={styles.texto}>
            {totalSalvas === 1
              ? '1 doação registrada neste aparelho.'
              : `${totalSalvas} doações registradas neste aparelho.`}
          </Text>
        </View>
      ) : null}
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  erro: { fontSize: 13, color: cores.erro },
  texto: { fontSize: 15, color: cores.texto },
  contador: {
    marginTop: espaco.sm,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.primariaClara,
    gap: espaco.xs,
  },
});
