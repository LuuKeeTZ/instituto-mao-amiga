import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Lista de rotas do app e os parâmetros que cada uma recebe.
export type RotasParamList = {
  Inicio: undefined;
  Pontos: undefined;
  PontoDetalhe: { id: string };
  DoacaoForm: undefined;
};

export type TelaProps<Nome extends keyof RotasParamList> = NativeStackScreenProps<
  RotasParamList,
  Nome
>;
