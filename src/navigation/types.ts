import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Doacao } from '../types/doacao';

// Lista de rotas do app e os parâmetros que cada uma recebe.
export type RotasParamList = {
  Inicio: undefined;
  Pontos: undefined;
  PontoDetalhe: { id: string };
  PontoForm: { id?: string } | undefined;
  DoacaoForm: { doacao?: Doacao } | undefined;
  Historico: undefined;
  DoacaoDetalhe: { doacao: Doacao };
};

export type TelaProps<Nome extends keyof RotasParamList> = NativeStackScreenProps<
  RotasParamList,
  Nome
>;
