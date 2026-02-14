import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getApostas, getBancas, deleteAposta, updateAposta } from "@/lib/storage";
import { Aposta, ResultadoAposta } from "@/types/betting";
import { Trash2, Download, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RESULTADO_CONFIG: Record<ResultadoAposta, { label: string; color: string }> = {
  ganhou: { label: "Ganhou", color: "bg-success/20 text-success" },
  perdeu: { label: "Perdeu", color: "bg-destructive/20 text-destructive" },
  pendente: { label: "Pendente", color: "bg-warning/20 text-warning" },
  cashout: { label: "Cashout", color: "bg-info/20 text-info" },
  reembolso: { label: "Reembolso", color: "bg-muted text-muted-foreground" },
};

export default function Historico() {
  const [apostas, setApostas] = useState<Aposta[]>(getApostas);
  const bancas = useMemo(() => getBancas(), []);
  const [search, setSearch] = useState("");
  const [filtroEsporte, setFiltroEsporte] = useState("todos");
  const [filtroResultado, setFiltroResultado] = useState("todos");
  const [ordenar, setOrdenar] = useState("data-desc");

  const refresh = () => setApostas(getApostas());

  const esportes = useMemo(() => [...new Set(apostas.map(a => a.esporte))], [apostas]);

  const filtered = useMemo(() => {
    let result = [...apostas];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.evento.toLowerCase().includes(q) ||
        a.competicao.toLowerCase().includes(q) ||
        a.mercado.toLowerCase().includes(q) ||
        (a.casaDeApostas || "").toLowerCase().includes(q)
      );
    }
    if (filtroEsporte !== "todos") result = result.filter(a => a.esporte === filtroEsporte);
    if (filtroResultado !== "todos") result = result.filter(a => a.resultado === filtroResultado);

    result.sort((a, b) => {
      switch (ordenar) {
        case "data-asc": return new Date(a.data).getTime() - new Date(b.data).getTime();
        case "lucro-desc": return b.lucro - a.lucro;
        case "lucro-asc": return a.lucro - b.lucro;
        case "odd-desc": return b.odd - a.odd;
        default: return new Date(b.data).getTime() - new Date(a.data).getTime();
      }
    });
    return result;
  }, [apostas, search, filtroEsporte, filtroResultado, ordenar]);

  const handleDelete = (id: string) => {
    if (confirm("Excluir esta aposta?")) {
      deleteAposta(id);
      refresh();
    }
  };

  const handleResultadoChange = (id: string, resultado: ResultadoAposta) => {
    const aposta = apostas.find(a => a.id === id);
    if (!aposta) return;
    let lucro = 0;
    if (resultado === 'ganhou') lucro = aposta.stake * (aposta.odd - 1);
    else if (resultado === 'perdeu') lucro = -aposta.stake;
    updateAposta(id, { resultado, lucro });
    refresh();
  };

  const exportCSV = () => {
    const headers = "Data,Esporte,Competição,Evento,Mercado,Odd,Stake,Resultado,Lucro,Casa,Tipster\n";
    const rows = filtered.map(a =>
      `${a.data},${a.esporte},${a.competicao},${a.evento},${a.mercado},${a.odd},${a.stake},${a.resultado},${a.lucro},${a.casaDeApostas || ''},${a.tipster || ''}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "apostas.csv";
    link.click();
  };

  const getBancaNome = (id: string) => bancas.find(b => b.id === id)?.nome || "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} apostas</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportCSV}>
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9" />
            </div>
            <Select value={filtroEsporte} onValueChange={setFiltroEsporte}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Esportes</SelectItem>
                {esportes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroResultado} onValueChange={setFiltroResultado}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ganhou">Ganhou</SelectItem>
                <SelectItem value="perdeu">Perdeu</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cashout">Cashout</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ordenar} onValueChange={setOrdenar}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="data-desc">Mais Recentes</SelectItem>
                <SelectItem value="data-asc">Mais Antigas</SelectItem>
                <SelectItem value="lucro-desc">Maior Lucro</SelectItem>
                <SelectItem value="lucro-asc">Maior Prejuízo</SelectItem>
                <SelectItem value="odd-desc">Maior Odd</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs">Data</TableHead>
              <TableHead className="text-xs">Evento</TableHead>
              <TableHead className="text-xs">Esporte</TableHead>
              <TableHead className="text-xs">Odd</TableHead>
              <TableHead className="text-xs">Stake</TableHead>
              <TableHead className="text-xs">Resultado</TableHead>
              <TableHead className="text-xs text-right">Lucro</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  Nenhuma aposta encontrada
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(aposta => {
                const cfg = RESULTADO_CONFIG[aposta.resultado];
                return (
                  <TableRow key={aposta.id} className="border-border">
                    <TableCell className="text-xs font-mono">{new Date(aposta.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{aposta.evento || aposta.mercado}</p>
                        <p className="text-[10px] text-muted-foreground">{aposta.competicao} • {getBancaNome(aposta.bancaId)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{aposta.esporte}</TableCell>
                    <TableCell className="text-xs font-mono font-medium">{aposta.odd.toFixed(2)}</TableCell>
                    <TableCell className="text-xs font-mono">R$ {aposta.stake.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={aposta.resultado} onValueChange={(v) => handleResultadoChange(aposta.id, v as ResultadoAposta)}>
                        <SelectTrigger className="h-7 w-[110px] border-0 bg-transparent p-0">
                          <Badge className={`${cfg.color} border-0 text-[10px]`}>{cfg.label}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">⏳ Pendente</SelectItem>
                          <SelectItem value="ganhou">✅ Ganhou</SelectItem>
                          <SelectItem value="perdeu">❌ Perdeu</SelectItem>
                          <SelectItem value="cashout">💰 Cashout</SelectItem>
                          <SelectItem value="reembolso">🔄 Reembolso</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className={`text-xs font-mono font-medium text-right ${aposta.lucro >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {aposta.lucro >= 0 ? '+' : ''}R$ {aposta.lucro.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(aposta.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
