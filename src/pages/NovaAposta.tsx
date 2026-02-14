import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { addAposta, getBancas, generateId } from "@/lib/storage";
import { Aposta, ResultadoAposta, TipoAposta } from "@/types/betting";
import { Target } from "lucide-react";

const ESPORTES = ["Futebol", "Basquete", "Tênis", "MMA/UFC", "Vôlei", "CS2", "LoL", "Outro"];

export default function NovaAposta() {
  const navigate = useNavigate();
  const bancas = useMemo(() => getBancas(), []);

  const [form, setForm] = useState({
    bancaId: bancas[0]?.id || "",
    tipo: "simples" as TipoAposta,
    esporte: "",
    competicao: "",
    evento: "",
    mercado: "",
    odd: "",
    stake: "",
    resultado: "pendente" as ResultadoAposta,
    casaDeApostas: "",
    tipster: "",
    categoria: "",
    aoVivo: false,
    freebet: false,
    notas: "",
    data: new Date().toISOString().split("T")[0],
  });

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const calcLucro = (): number => {
    const odd = parseFloat(form.odd) || 0;
    const stake = parseFloat(form.stake) || 0;
    if (form.resultado === 'ganhou') return stake * (odd - 1);
    if (form.resultado === 'perdeu') return -stake;
    if (form.resultado === 'cashout') return 0; // user should edit manually
    return 0;
  };

  const handleSubmit = () => {
    if (!form.bancaId || !form.esporte || !form.odd || !form.stake) return;
    const aposta: Aposta = {
      id: generateId(),
      bancaId: form.bancaId,
      tipo: form.tipo,
      esporte: form.esporte,
      competicao: form.competicao,
      evento: form.evento,
      mercado: form.mercado,
      odd: parseFloat(form.odd),
      stake: parseFloat(form.stake),
      resultado: form.resultado,
      lucro: calcLucro(),
      data: form.data,
      casaDeApostas: form.casaDeApostas || undefined,
      tipster: form.tipster || undefined,
      categoria: form.categoria || undefined,
      aoVivo: form.aoVivo,
      freebet: form.freebet,
      notas: form.notas || undefined,
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nova Aposta</h1>
        <p className="text-sm text-muted-foreground">Registre uma nova aposta</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Banca</Label>
              <Select value={form.bancaId} onValueChange={v => set("bancaId", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bancas.map(b => <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input type="date" value={form.data} onChange={e => set("data", e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Esporte</Label>
              <Select value={form.esporte} onValueChange={v => set("esporte", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Competição</Label>
              <Input value={form.competicao} onChange={e => set("competicao", e.target.value)} placeholder="Ex: Brasileirão" className="mt-1" />
            </div>
          </div>

          {/* Row 3 */}
          <div>
            <Label>Evento</Label>
            <Input value={form.evento} onChange={e => set("evento", e.target.value)} placeholder="Ex: Flamengo x Palmeiras" className="mt-1" />
          </div>

          <div>
            <Label>Mercado / Tipo de Aposta</Label>
            <Input value={form.mercado} onChange={e => set("mercado", e.target.value)} placeholder="Ex: Resultado Final, Over 2.5" className="mt-1" />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Odd</Label>
              <Input type="number" step="0.01" value={form.odd} onChange={e => set("odd", e.target.value)} placeholder="1.50" className="mt-1" />
            </div>
            <div>
              <Label>Stake (R$)</Label>
              <Input type="number" step="0.01" value={form.stake} onChange={e => set("stake", e.target.value)} placeholder="10.00" className="mt-1" />
            </div>
            <div>
              <Label>Resultado</Label>
              <Select value={form.resultado} onValueChange={v => set("resultado", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">⏳ Pendente</SelectItem>
                  <SelectItem value="ganhou">✅ Ganhou</SelectItem>
                  <SelectItem value="perdeu">❌ Perdeu</SelectItem>
                  <SelectItem value="cashout">💰 Cashout</SelectItem>
                  <SelectItem value="reembolso">🔄 Reembolso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Casa de Apostas</Label>
              <Input value={form.casaDeApostas} onChange={e => set("casaDeApostas", e.target.value)} placeholder="Ex: Bet365" className="mt-1" />
            </div>
            <div>
              <Label>Tipster</Label>
              <Input value={form.tipster} onChange={e => set("tipster", e.target.value)} placeholder="Ex: João Tips" className="mt-1" />
            </div>
          </div>

          {/* Switches */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.aoVivo} onCheckedChange={v => set("aoVivo", v)} />
              <Label className="text-sm">Ao Vivo</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.freebet} onCheckedChange={v => set("freebet", v)} />
              <Label className="text-sm">Freebet</Label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notas</Label>
            <Textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Observações..." className="mt-1" rows={2} />
          </div>

          {/* Lucro preview */}
          {form.resultado !== 'pendente' && form.odd && form.stake && (
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-xs text-muted-foreground">Lucro/Prejuízo estimado:</p>
              <p className={`text-lg font-bold font-mono ${calcLucro() >= 0 ? 'text-success' : 'text-destructive'}`}>
                {calcLucro() >= 0 ? '+' : ''}R$ {calcLucro().toFixed(2)}
              </p>
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Registrar Aposta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
