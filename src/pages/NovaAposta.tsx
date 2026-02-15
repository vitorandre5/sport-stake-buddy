import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAposta, getBancas, generateId } from "@/lib/storage";
import { Aposta } from "@/types/betting";
import { X, Plus, Target } from "lucide-react";
import SelecaoCard, { SelecaoData, emptySelecao } from "@/components/aposta/SelecaoCard";
import FormatoAposta from "@/components/aposta/FormatoAposta";
import ValorAposta from "@/components/aposta/ValorAposta";
import MaisOpcoes, { emptyMaisOpcoes } from "@/components/aposta/MaisOpcoes";

const CASAS = ["Bet365", "Betano", "Sportingbet", "1xBet", "Pixbet", "KTO", "Betfair", "Pinnacle", "Outro"];

export default function NovaAposta() {
  const navigate = useNavigate();
  const bancas = useMemo(() => getBancas(), []);

  // General info
  const [bancaId, setBancaId] = useState(bancas[0]?.id || "");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [casaDeApostas, setCasaDeApostas] = useState("");

  // Selections
  const [selecoes, setSelecoes] = useState<SelecaoData[]>([emptySelecao()]);

  // Format
  const [formato, setFormato] = useState<"simples" | "back" | "lay">("back");
  const [multipla, setMultipla] = useState(false);

  // Value
  const [valor, setValor] = useState("");
  const [percentual, setPercentual] = useState("");

  // More options
  const [maisOpcoes, setMaisOpcoes] = useState(emptyMaisOpcoes());

  const updateSelecao = (i: number, s: SelecaoData) => {
    const copy = [...selecoes];
    copy[i] = s;
    setSelecoes(copy);
  };

  const removeSelecao = (i: number) => setSelecoes(selecoes.filter((_, idx) => idx !== i));
  const addSelecao = () => setSelecoes([...selecoes, emptySelecao()]);

  const mapEstado = (estado: string) => {
    const map: Record<string, string> = { Pendente: "pendente", Ganhou: "ganhou", Perdeu: "perdeu", Cashout: "cashout", Reembolso: "reembolso" };
    return (map[estado] || "pendente") as Aposta["resultado"];
  };

  const calcLucro = (resultado: Aposta["resultado"], odd: number, stake: number): number => {
    if (resultado === "ganhou") return stake * (odd - 1);
    if (resultado === "perdeu") return -stake;
    return 0;
  };

  const handleSubmit = () => {
    const sel = selecoes[0];
    if (!bancaId || !sel?.esporte || !sel?.cotacao || !valor) return;

    const odd = selecoes.length > 1
      ? selecoes.reduce((acc, s) => acc * (parseFloat(s.cotacao) || 1), 1)
      : parseFloat(sel.cotacao) || 0;

    const stake = parseFloat(valor) || 0;
    const resultado = mapEstado(sel.estado);

    const aposta: Aposta = {
      id: generateId(),
      bancaId,
      tipo: selecoes.length > 1 ? "combinada" : "simples",
      esporte: sel.esporte,
      competicao: sel.competicao,
      evento: sel.titulo,
      mercado: sel.tipoAposta,
      odd,
      stake,
      resultado,
      lucro: calcLucro(resultado, odd, stake),
      data: `${data}T${hora}`,
      casaDeApostas: casaDeApostas || undefined,
      tipster: maisOpcoes.tipster || undefined,
      categoria: sel.categoria || undefined,
      aoVivo: maisOpcoes.aoVivo,
      freebet: maisOpcoes.apostaGratuita,
      notas: maisOpcoes.comentario || undefined,
      selecoes: selecoes.length > 1
        ? selecoes.map(s => ({
            esporte: s.esporte,
            competicao: s.competicao,
            evento: s.titulo,
            mercado: s.tipoAposta,
            odd: parseFloat(s.cotacao) || 0,
            resultado: mapEstado(s.estado),
          }))
        : undefined,
    };

    addAposta(aposta);
    navigate("/historico");
  };

  if (bancas.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Nova Aposta</h1>
        <Card className="bg-card border-border border-dashed">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Crie uma banca primeiro</p>
            <Button className="mt-4" onClick={() => navigate("/bancas")}>Ir para Bancas</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Adicionar aposta</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* General info */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Data</Label>
              <Input type="date" value={data} onChange={e => setData(e.target.value)} className="mt-1 bg-background" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Hora</Label>
              <Input type="time" value={hora} onChange={e => setHora(e.target.value)} className="mt-1 bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Banca</Label>
              <Select value={bancaId} onValueChange={setBancaId}>
                <SelectTrigger className="mt-1 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>{bancas.map(b => <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Casa de apostas</Label>
              <Select value={casaDeApostas} onValueChange={setCasaDeApostas}>
                <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{CASAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selections */}
      {selecoes.map((sel, i) => (
        <SelecaoCard
          key={i}
          index={i}
          data={sel}
          onChange={s => updateSelecao(i, s)}
          onRemove={() => removeSelecao(i)}
          canRemove={selecoes.length > 1}
        />
      ))}

      <Button variant="outline" onClick={addSelecao} className="w-full border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar uma seleção
      </Button>

      {/* Bet format */}
      <FormatoAposta formato={formato} onFormatoChange={setFormato} multipla={multipla} onMultiplaChange={setMultipla} />

      {/* Value */}
      <ValorAposta formato={formato} valor={valor} onValorChange={setValor} percentual={percentual} onPercentualChange={setPercentual} />

      {/* More options */}
      <MaisOpcoes data={maisOpcoes} onChange={setMaisOpcoes} />

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 neon-glow"
            size="lg"
          >
            Adicionar aposta
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">Limite de apostas — 2%</p>
        </div>
      </div>
    </div>
  );
}
