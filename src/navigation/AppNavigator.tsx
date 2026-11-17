import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PontoDetalheScreen from '../screens/PontoDetalheScreen';
import PontosScreen from '../screens/PontosScreen';
import { cores } from '../theme';
import { RotasParamList } from './types';

const Stack = createNativeStackNavigator<RotasParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Pontos"
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.branco,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="Pontos" component={PontosScreen} options={{ title: 'Pontos de coleta' }} />
        <Stack.Screen
          name="PontoDetalhe"
          component={PontoDetalheScreen}
          options={{ title: 'Detalhes do ponto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
