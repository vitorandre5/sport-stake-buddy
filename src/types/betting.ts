export interface Banca {
  id: string;
  nome: string;
  saldoInicial: number;
  saldoAtual: number;
  criadaEm: string;
  cor: string;
}

export interface Transacao {
  id: string;
  bancaId: string;
  tipo: 'deposito' | 'saque';
  valor: number;
  data: string;
  descricao?: string;
}

export type ResultadoAposta = 'ganhou' | 'perdeu' | 'pendente' | 'cashout' | 'reembolso';
export type TipoAposta = 'simples' | 'combinada';

export interface Aposta {
  id: string;
  bancaId: string;
  tipo: TipoAposta;
  esporte: string;
  competicao: string;
  evento: string;
  mercado: string;
  odd: number;
  stake: number;
  resultado: ResultadoAposta;
  lucro: number;
  data: string;
  casaDeApostas?: string;
  tipster?: string;
  categoria?: string;
  aoVivo: boolean;
  freebet: boolean;
  notas?: string;
  // For combinada
  selecoes?: SelecaoAposta[];
}

export interface SelecaoAposta {
  esporte: string;
  competicao: string;
  evento: string;
  mercado: string;
  odd: number;
  resultado: ResultadoAposta;
}

export interface DashboardStats {
  totalApostas: number;
  apostasGanhas: number;
  apostasPerdidas: number;
  apostasPendentes: number;
  lucroTotal: number;
  roi: number;
  taxaAcerto: number;
  oddMedia: number;
  stakeMedia: number;
  streakAtual: number;
  maiorStreak: number;
}

export interface FiltrosAposta {
  periodo?: { inicio: string; fim: string };
  esporte?: string;
  casaDeApostas?: string;
  tipster?: string;
  tipo?: TipoAposta;
  resultado?: ResultadoAposta;
  bancaId?: string;
}
