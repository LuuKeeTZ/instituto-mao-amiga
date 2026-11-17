import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../theme';
import BotaoAcao from './BotaoAcao';

interface Props {
  carregandoMais: boolean;
  erroMais: string | null;
  chegouAoFim: boolean;
  temItens: boolean;
  textoFim: string;
  onTentarDeNovo: () => void;
}

/** Rodapé das listas paginadas: carregando mais, erro ao carregar mais, ou fim da lista. */
export default function RodapeLista(p: Props) {
  return (
    <View style={styles.rodape}>
      {p.carregandoMais ? <ActivityIndicator color={cores.primaria} /> : null}
      {p.erroMais ? (
        <>
          <Text style={styles.erro}>{p.erroMais}</Text>
          <BotaoAcao titulo="Tentar de novo" variante="secundario" onPress={p.onTentarDeNovo} />
        </>
      ) : null}
      {p.chegouAoFim && p.temItens ? <Text style={styles.fim}>{p.textoFim}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: { paddingVertical: espaco.lg, gap: espaco.sm },
  erro: { fontSize: 14, color: cores.erro, textAlign: 'center' },
  fim: { fontSize: 13, color: cores.textoSuave, textAlign: 'center' },
});
