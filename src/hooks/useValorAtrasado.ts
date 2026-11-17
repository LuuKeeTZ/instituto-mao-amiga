import { useEffect, useState } from 'react';

/** Devolve o valor só depois que ele parar de mudar por `atraso` ms (para não buscar a cada letra). */
export function useValorAtrasado<T>(valor: T, atraso = 400): T {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const relogio = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(relogio);
  }, [valor, atraso]);
  return atrasado;
}
