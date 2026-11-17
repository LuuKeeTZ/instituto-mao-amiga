import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Lista de rotas do app e os parâmetros que cada uma recebe.
export type RotasParamList = {
  Inicio: undefined;
  Pontos: undefined;
  PontoDetalhe: { id: string };
  PontoForm: { id?: string } | undefined;
  DoacaoForm: { id?: string } | undefined;
  Historico: undefined;
  DoacaoDetalhe: { id: string };
};

export type TelaProps<Nome extends keyof RotasParamList> = NativeStackScreenProps<
  RotasParamList,
  Nome
>;
