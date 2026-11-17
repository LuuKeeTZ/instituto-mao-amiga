import { Ponto } from '../types/ponto';

// Dados de exemplo usados enquanto o app ainda não conversa com um servidor.
export const PONTOS_EXEMPLO: Ponto[] = [
  {
    id: 'p1',
    nome: 'Casa Solidária Vila Nova',
    endereco: 'Rua 214, nº 120',
    bairro: 'Vila Nova',
    horario: 'Seg a Sex, 8h às 17h',
    tipo: 'coleta',
    itens: ['Roupas', 'Calçados', 'Cobertores'],
  },
  {
    id: 'p2',
    nome: 'Armazém do Bem Campinas',
    endereco: 'Rua Senador Jaime, nº 455',
    bairro: 'Campinas',
    horario: 'Ter a Sáb, 9h às 16h',
    tipo: 'distribuição',
    itens: ['Cestas básicas', 'Leite em pó'],
  },
  {
    id: 'p3',
    nome: 'Ponto Amigo Jardim América',
    endereco: 'Rua C-140, nº 300',
    bairro: 'Jardim América',
    horario: 'Seg, Qua e Sex, 13h às 18h',
    tipo: 'coleta',
    itens: ['Alimentos não perecíveis', 'Produtos de higiene'],
  },
  {
    id: 'p4',
    nome: 'Sacolão Comunitário Novo Horizonte',
    endereco: 'Avenida Pedro Paulo de Souza, nº 78',
    bairro: 'Novo Horizonte',
    horario: 'Sábados, 8h às 12h',
    tipo: 'distribuição',
    itens: ['Hortifrúti', 'Pães'],
  },
];
