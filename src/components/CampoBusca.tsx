import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cores, espaco, raio, TOQUE_MINIMO } from '../theme';

interface Props {
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
  rotulo: string;
}

export default function CampoBusca({ valor, onChange, placeholder, rotulo }: Props) {
  return (
    <View style={styles.caixa}>
      <Text style={styles.lupa}>⌕</Text>
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSuave}
        accessibilityLabel={rotulo}
        autoCorrect={false}
        returnKeyType="search"
        style={styles.entrada}
      />
      {valor ? (
        <TouchableOpacity
          onPress={() => onChange('')}
          style={styles.limpar}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <Text style={styles.limparTexto}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOQUE_MINIMO,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.pill,
    paddingLeft: espaco.md,
  },
  lupa: { fontSize: 20, color: cores.textoSuave, marginRight: espaco.xs },
  entrada: { flex: 1, minHeight: TOQUE_MINIMO, fontSize: 16, color: cores.texto },
  limpar: {
    width: TOQUE_MINIMO,
    height: TOQUE_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limparTexto: { fontSize: 16, color: cores.textoSuave },
});
