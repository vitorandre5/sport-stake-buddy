import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const ESPORTES = ["Futebol", "Basquete", "Tênis", "MMA/UFC", "Vôlei", "CS2", "LoL", "Outro"];
const CATEGORIAS = ["Pré-jogo", "Ao vivo", "Especial", "Longo prazo"];
const COMPETICOES = ["Brasileirão", "Champions League", "Premier League", "La Liga", "Serie A", "Ligue 1", "Copa do Mundo", "Libertadores", "Outro"];
const TIPOS_APOSTA = ["Resultado Final", "Over/Under", "Ambas Marcam", "Handicap", "Placar Exato", "Gols", "Escanteios", "Cartões", "Outro"];
const ESTADOS = ["Pendente", "Ganhou", "Perdeu", "Cashout", "Reembolso"];

export interface SelecaoData {
  titulo: string;
  cotacao: string;
  esporte: string;
  estado: string;
  categoria: string;
  competicao: string;
  tipoAposta: string;
  closingOdds: string;
  probEstimada: string;
}

interface SelecaoCardProps {
  index: number;
  data: SelecaoData;
  onChange: (data: SelecaoData) => void;
  onRemove?: () => void;
  canRemove: boolean;
}

export const emptySelecao = (): SelecaoData => ({
  titulo: "",
  cotacao: "",
  esporte: "",
  estado: "Pendente",
  categoria: "",
  competicao: "",
  tipoAposta: "",
  closingOdds: "",
  probEstimada: "",
});

export default function SelecaoCard({ index, data, onChange, onRemove, canRemove }: SelecaoCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const set = (key: keyof SelecaoData, value: string) => onChange({ ...data, [key]: value });

  return (
    <Card className="bg-secondary/50 border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Seleção {index + 1}</h3>
          {canRemove && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Título da aposta</Label>
          <Input value={data.titulo} onChange={e => set("titulo", e.target.value)} placeholder="Ex: Real Madrid - Bayern Munich" className="mt-1 bg-background" />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Cotação</Label>
          <Input type="number" step="0.01" value={data.cotacao} onChange={e => set("cotacao", e.target.value)} placeholder="Ex: 1.50" className="mt-1 bg-background" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Esporte</Label>
            <Select value={data.esporte} onValueChange={v => set("esporte", v)}>
              <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>{ESPORTES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Estado</Label>
            <Select value={data.estado} onValueChange={v => set("estado", v)}>
              <SelectTrigger className="mt-1 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>{ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Categoria</Label>
            <Select value={data.categoria} onValueChange={v => set("categoria", v)}>
              <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Competição</Label>
            <Select value={data.competicao} onValueChange={v => set("competicao", v)}>
              <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>{COMPETICOES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Tipo de aposta</Label>
          <Select value={data.tipoAposta} onValueChange={v => set("tipoAposta", v)}>
            <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>{TIPOS_APOSTA.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* Collapsible details */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
              {detailsOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              {detailsOpen ? "Menos detalhes" : "Mais detalhes"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2 animate-accordion-down">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Closing Odds</Label>
                <Input type="number" step="0.01" value={data.closingOdds} onChange={e => set("closingOdds", e.target.value)} placeholder="0.00" className="mt-1 bg-background" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Prob estim. (%)</Label>
                <Input type="number" step="0.1" value={data.probEstimada} onChange={e => set("probEstimada", e.target.value)} placeholder="0.0" className="mt-1 bg-background" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
