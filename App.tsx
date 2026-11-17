import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PONTOS_EXEMPLO } from './src/data/pontosExemplo';
import PontoDetalheScreen from './src/screens/PontoDetalheScreen';
import PontosScreen from './src/screens/PontosScreen';
import { cores } from './src/theme';

// Ainda sem navegação: a lista e o detalhe do primeiro ponto aparecem lado a lado
// (um embaixo do outro) só para conferir as duas telas.
export default function App() {
  return (
    <View style={styles.app}>
      <View style={styles.metade}>
        <PontosScreen />
      </View>
      <View style={[styles.metade, styles.divisor]}>
        <PontoDetalheScreen ponto={PONTOS_EXEMPLO[0]} />
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, paddingTop: 32, backgroundColor: cores.fundo },
  metade: { flex: 1 },
  divisor: { borderTopWidth: 2, borderTopColor: cores.borda },
});
