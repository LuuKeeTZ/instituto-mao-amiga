// Único arquivo do app que chama fetch. As telas usam os services
// (pontosService, doacoesService), que usam estas quatro funções.

/**
 * Endereço da API. Para testar no celular, troque pelo IPv4 do computador
 * que está rodando a API (ipconfig no Windows) — "localhost" no celular
 * aponta para o próprio celular. O celular e o computador precisam estar
 * na mesma rede Wi-Fi.
 */
export const API_URL = 'http://192.168.15.49:8080/api/v1';

const TEMPO_LIMITE_MS = 10000;

/** Erro de chamada à API. status 0 = não conseguiu falar com o servidor. */
export class ApiErro extends Error {
  readonly status: number;
  readonly corpo: unknown;

  constructor(status: number, mensagem: string, corpo?: unknown) {
    super(mensagem);
    this.name = 'ApiErro';
    this.status = status;
    this.corpo = corpo;
  }
}

async function requisitar<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });
  } catch {
    throw new ApiErro(
      0,
      'Não foi possível conectar ao servidor. Verifique se a API está ligada e se o celular está na mesma rede.',
    );
  } finally {
    clearTimeout(relogio);
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!resposta.ok) {
    const mensagem =
      (dados as { mensagem?: string } | null)?.mensagem ?? `A API respondeu com erro ${resposta.status}.`;
    throw new ApiErro(resposta.status, mensagem, dados);
  }
  return dados as T;
}

export function get<T>(caminho: string): Promise<T> {
  return requisitar<T>('GET', caminho);
}

export function post<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>('POST', caminho, corpo);
}

export function put<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>('PUT', caminho, corpo);
}

export function del(caminho: string): Promise<void> {
  return requisitar<void>('DELETE', caminho);
}

/** Monta "?a=1&b=x" ignorando valores vazios. */
export function montarQuery(params: Record<string, string | number | undefined>): string {
  const partes = Object.entries(params)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`);
  return partes.length ? `?${partes.join('&')}` : '';
}
