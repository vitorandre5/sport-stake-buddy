import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getBancas, addBanca, deleteBanca, addTransacao, generateId, getTransacoes } from "@/lib/storage";
import { Banca } from "@/types/betting";
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

const CORES = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899'];

export default function Bancas() {
  const [bancas, setBancas] = useState<Banca[]>(getBancas);
  const [showNew, setShowNew] = useState(false);
  const [showTransacao, setShowTransacao] = useState<{ bancaId: string; tipo: 'deposito' | 'saque' } | null>(null);
  const [nome, setNome] = useState("");
  const [saldoInicial, setSaldoInicial] = useState("");
  const [transacaoValor, setTransacaoValor] = useState("");
  const [transacaoDesc, setTransacaoDesc] = useState("");

  const refresh = useCallback(() => setBancas(getBancas()), []);

  const handleAddBanca = () => {
    if (!nome || !saldoInicial) return;
    const banca: Banca = {
      id: generateId(),
      nome,
      saldoInicial: parseFloat(saldoInicial),
      saldoAtual: parseFloat(saldoInicial),
      criadaEm: new Date().toISOString(),
      cor: CORES[bancas.length % CORES.length],
    };
    addBanca(banca);
    setNome("");
    setSaldoInicial("");
    setShowNew(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta banca e todas as apostas associadas?")) {
      deleteBanca(id);
      refresh();
    }
  };

  const handleTransacao = () => {
    if (!showTransacao || !transacaoValor) return;
    addTransacao({
      id: generateId(),
      bancaId: showTransacao.bancaId,
      tipo: showTransacao.tipo,
      valor: parseFloat(transacaoValor),
      data: new Date().toISOString(),
      descricao: transacaoDesc || undefined,
    });
    setTransacaoValor("");
    setTransacaoDesc("");
    setShowTransacao(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bancas</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas bancas de apostas</p>
        </div>
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Nova Banca
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Nova Banca</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome da Banca</Label>
                <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Banca Principal" className="mt-1" />
              </div>
              <div>
                <Label>Saldo Inicial (R$)</Label>
                <Input type="number" value={saldoInicial} onChange={e => setSaldoInicial(e.target.value)} placeholder="0.00" className="mt-1" />
              </div>
              <Button onClick={handleAddBanca} className="w-full">Criar Banca</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {bancas.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-12 text-center">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma banca criada ainda</p>
            <p className="text-xs text-muted-foreground mt-1">Crie sua primeira banca para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bancas.map(banca => {
            const lucro = banca.saldoAtual - banca.saldoInicial;
            const transacoes = getTransacoes().filter(t => t.bancaId === banca.id);
            const totalDepositos = transacoes.filter(t => t.tipo === 'deposito').reduce((s, t) => s + t.valor, 0);
            const totalSaques = transacoes.filter(t => t.tipo === 'saque').reduce((s, t) => s + t.valor, 0);

            return (
              <Card key={banca.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: banca.cor }} />
                      <CardTitle className="text-base">{banca.nome}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(banca.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold font-mono text-foreground">R$ {banca.saldoAtual.toFixed(2)}</p>
                    <p className={`text-xs font-mono ${lucro >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {lucro >= 0 ? '+' : ''}R$ {lucro.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Depósitos: R$ {totalDepositos.toFixed(2)}</span>
                    <span>Saques: R$ {totalSaques.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => setShowTransacao({ bancaId: banca.id, tipo: 'deposito' })}>
                      <ArrowUpCircle className="w-3 h-3 text-success" /> Depósito
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => setShowTransacao({ bancaId: banca.id, tipo: 'saque' })}>
                      <ArrowDownCircle className="w-3 h-3 text-destructive" /> Saque
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Transaction Dialog */}
      <Dialog open={!!showTransacao} onOpenChange={() => setShowTransacao(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{showTransacao?.tipo === 'deposito' ? 'Novo Depósito' : 'Novo Saque'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" value={transacaoValor} onChange={e => setTransacaoValor(e.target.value)} placeholder="0.00" className="mt-1" />
            </div>
            <div>
              <Label>Descrição (opcional)</Label>
              <Input value={transacaoDesc} onChange={e => setTransacaoDesc(e.target.value)} placeholder="Ex: PIX" className="mt-1" />
            </div>
            <Button onClick={handleTransacao} className="w-full">Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
