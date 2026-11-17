import { useHeaderHeight } from '@react-navigation/elements';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { cores, espaco, LARGURA_MAXIMA } from '../theme';

interface Props {
  children: ReactNode;
}

/**
 * Base de toda tela com campos de texto: o KeyboardAvoidingView empurra o
 * conteúdo para cima quando o teclado abre e o ScrollView deixa rolar até
 * o campo que está sendo digitado.
 */
export default function TelaFormulario({ children }: Props) {
  const alturaCabecalho = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={alturaCabecalho}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
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
});
