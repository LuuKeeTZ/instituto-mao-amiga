import { Alert, Platform } from 'react-native';

// No celular usamos Alert.alert. No navegador o Alert do react-native-web
// não abre nada, então caímos no alert/confirm do próprio navegador.

export function avisar(titulo: string, mensagem: string, aoFechar?: () => void) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    aoFechar?.();
    return;
  }
  Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: aoFechar }]);
}

export function confirmarExclusao(titulo: string, mensagem: string, aoConfirmar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
  ]);
}
