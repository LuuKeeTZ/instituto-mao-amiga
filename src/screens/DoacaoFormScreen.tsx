import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import CampoTexto from '../components/CampoTexto';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import TelaFormulario from '../components/TelaFormulario';
import { PONTOS_EXEMPLO } from '../data/pontosExemplo';
import { cores, espaco, raio } from '../theme';
import { Doacao, DoacaoFormValores, ErrosDoacao } from '../types/doacao';
import { avisar } from '../utils/dialogos';
import { temErros, validarDoacao } from '../utils/validacaoDoacao';

const CHAVE_ULTIMA = '@maoamiga/ultima-doacao';
const VAZIO: DoacaoFormValores = { tipoItem: '', quantidade: '', pontoDestino: '' };

export default function DoacaoFormScreen() {
  const [valores, setValores] = useState<DoacaoFormValores>(VAZIO);
  const [erros, setErros] = useState<ErrosDoacao>({});
  const [ultima, setUltima] = useState<Doacao | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_ULTIMA).then((json) => setUltima(json ? JSON.parse(json) : null));
  }, []);

  function alterar(campo: keyof DoacaoFormValores, texto: string) {
    setValores((atual) => ({ ...atual, [campo]: texto }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function registrar() {
    const encontrados = validarDoacao(valores);
    setErros(encontrados);
    if (temErros(encontrados)) return;

    const doacao: Doacao = {
      id: Date.now().toString(36),
      tipoItem: valores.tipoItem.trim(),
      quantidade: Number(valores.quantidade),
      pontoDestino: valores.pontoDestino,
      criadoEm: new Date().toISOString(),
    };
    await AsyncStorage.setItem(CHAVE_ULTIMA, JSON.stringify(doacao));
    setUltima(doacao);
    setValores(VAZIO);
    avisar('Doação registrada', `${doacao.quantidade} × ${doacao.tipoItem} para ${doacao.pontoDestino}.`);
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

      <BotaoAcao titulo="Registrar doação" onPress={registrar} />

      {ultima ? (
        <View style={styles.ultima}>
          <Text style={styles.rotulo}>Última doação registrada</Text>
          <Text style={styles.texto}>
            {ultima.quantidade} × {ultima.tipoItem} → {ultima.pontoDestino}
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
  ultima: {
    marginTop: espaco.sm,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.primariaClara,
    gap: espaco.xs,
  },
});
