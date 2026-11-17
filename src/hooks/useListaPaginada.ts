import { useCallback, useRef, useState } from 'react';
import { Pagina } from '../types/pagina';
import { mensagemDeErro } from '../utils/mensagemErro';

type Buscar<T> = (termo: string, pagina: number) => Promise<Pagina<T>>;

/**
 * Rolagem infinita sobre um endpoint paginado da API.
 * - nunca pede a mesma página duas vezes (Set de páginas pedidas);
 * - para na última página (usa o totalPages da resposta);
 * - cada termo de busca novo recomeça da página 0 e ignora respostas atrasadas da busca anterior.
 */
export function useListaPaginada<T>(buscar: Buscar<T>, termo: string) {
  const [itens, setItens] = useState<T[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [carregando, setCarregando] = useState<'primeira' | 'mais' | null>('primeira');
  const [erro, setErro] = useState<string | null>(null);
  const [erroMais, setErroMais] = useState<string | null>(null);
  const [chegouAoFim, setChegouAoFim] = useState(false);
  const controle = useRef({
    termo: '',
    proxima: 0,
    totalPaginas: Infinity,
    pedidas: new Set<number>(),
    emAndamento: false,
    geracao: 0,
  });

  const carregarPagina = useCallback(
    async (pagina: number) => {
      const c = controle.current;
      if (c.emAndamento || c.pedidas.has(pagina) || pagina >= c.totalPaginas) return;
      c.emAndamento = true;
      c.pedidas.add(pagina);
      const geracao = c.geracao;
      setCarregando(pagina === 0 ? 'primeira' : 'mais');
      try {
        const resposta = await buscar(c.termo, pagina);
        if (geracao !== c.geracao) return;
        c.totalPaginas = resposta.page.totalPages;
        c.proxima = pagina + 1;
        setTotal(resposta.page.totalElements);
        setChegouAoFim(c.proxima >= c.totalPaginas);
        setItens((atuais) => (pagina === 0 ? resposta.content : [...atuais, ...resposta.content]));
        setErro(null);
        setErroMais(null);
      } catch (e) {
        if (geracao !== c.geracao) return;
        c.pedidas.delete(pagina); // falhou: libera para tentar de novo
        if (pagina === 0) setErro(mensagemDeErro(e));
        else setErroMais(mensagemDeErro(e));
      } finally {
        if (geracao === c.geracao) {
          c.emAndamento = false;
          setCarregando(null);
        }
      }
    },
    [buscar],
  );

  const recomecar = useCallback(() => {
    controle.current = {
      termo,
      proxima: 0,
      totalPaginas: Infinity,
      pedidas: new Set(),
      emAndamento: false,
      geracao: controle.current.geracao + 1,
    };
    setItens([]);
    setTotal(null);
    setChegouAoFim(false);
    setErro(null);
    setErroMais(null);
    carregarPagina(0);
  }, [termo, carregarPagina]);

  const carregarMais = useCallback(() => carregarPagina(controle.current.proxima), [carregarPagina]);

  return { itens, total, carregando, erro, erroMais, chegouAoFim, recomecar, carregarMais };
}
