import { Aposta, Banca, Transacao } from "@/types/betting";

// Generic localStorage helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Bancas
export function getBancas(): Banca[] {
  return getItem<Banca[]>('bancas', []);
}

export function saveBancas(bancas: Banca[]): void {
  setItem('bancas', bancas);
}

export function addBanca(banca: Banca): void {
  const bancas = getBancas();
  bancas.push(banca);
  saveBancas(bancas);
}

export function updateBanca(id: string, updates: Partial<Banca>): void {
  const bancas = getBancas().map(b => b.id === id ? { ...b, ...updates } : b);
  saveBancas(bancas);
}

export function deleteBanca(id: string): void {
  saveBancas(getBancas().filter(b => b.id !== id));
  // Also delete associated bets and transactions
  saveApostas(getApostas().filter(a => a.bancaId !== id));
  saveTransacoes(getTransacoes().filter(t => t.bancaId !== id));
}

// Transações
export function getTransacoes(): Transacao[] {
  return getItem<Transacao[]>('transacoes', []);
}

export function saveTransacoes(transacoes: Transacao[]): void {
  setItem('transacoes', transacoes);
}

export function addTransacao(transacao: Transacao): void {
  const transacoes = getTransacoes();
  transacoes.push(transacao);
  saveTransacoes(transacoes);
  // Update banca balance
  const bancas = getBancas();
  const banca = bancas.find(b => b.id === transacao.bancaId);
  if (banca) {
    banca.saldoAtual += transacao.tipo === 'deposito' ? transacao.valor : -transacao.valor;
    saveBancas(bancas);
  }
}

// Apostas
export function getApostas(): Aposta[] {
  return getItem<Aposta[]>('apostas', []);
}

export function saveApostas(apostas: Aposta[]): void {
  setItem('apostas', apostas);
}

export function addAposta(aposta: Aposta): void {
  const apostas = getApostas();
  apostas.push(aposta);
  saveApostas(apostas);
  // Update banca balance
  if (aposta.resultado !== 'pendente') {
    recalcularSaldoBanca(aposta.bancaId);
  }
}

export function updateAposta(id: string, updates: Partial<Aposta>): void {
  const apostas = getApostas().map(a => a.id === id ? { ...a, ...updates } : a);
  saveApostas(apostas);
  const aposta = apostas.find(a => a.id === id);
  if (aposta) recalcularSaldoBanca(aposta.bancaId);
}

export function deleteAposta(id: string): void {
  const aposta = getApostas().find(a => a.id === id);
  saveApostas(getApostas().filter(a => a.id !== id));
  if (aposta) recalcularSaldoBanca(aposta.bancaId);
}

export function recalcularSaldoBanca(bancaId: string): void {
  const bancas = getBancas();
  const banca = bancas.find(b => b.id === bancaId);
  if (!banca) return;

  const transacoes = getTransacoes().filter(t => t.bancaId === bancaId);
  const apostas = getApostas().filter(a => a.bancaId === bancaId && a.resultado !== 'pendente');

  let saldo = banca.saldoInicial;
  transacoes.forEach(t => {
    saldo += t.tipo === 'deposito' ? t.valor : -t.valor;
  });
  apostas.forEach(a => {
    saldo += a.lucro;
  });

  banca.saldoAtual = saldo;
  saveBancas(bancas);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
