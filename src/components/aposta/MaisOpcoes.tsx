import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Percent, Star, Tv, Ticket, Coins, ArrowLeftRight, EyeOff } from "lucide-react";

interface MaisOpcoesData {
  tipster: string;
  comissao: boolean;
  bonusGanho: boolean;
  aoVivo: boolean;
  apostaGratuita: boolean;
  cashout: boolean;
  eachWay: boolean;
  mascarar: boolean;
  comentario: string;
}

interface MaisOpcoesProps {
  data: MaisOpcoesData;
  onChange: (data: MaisOpcoesData) => void;
}

const TIPSTERS = ["João Tips", "Carlos Bet", "Maria Pro", "Outro"];

const checkboxItems = [
  { key: "comissao" as const, label: "Comissão", icon: Percent, hasParams: true },
  { key: "bonusGanho" as const, label: "Bônus de ganho", icon: Star, hasParams: false },
  { key: "aoVivo" as const, label: "Aposta ao vivo", icon: Tv, hasParams: false },
  { key: "apostaGratuita" as const, label: "Aposta gratuita", icon: Ticket, hasParams: false },
  { key: "cashout" as const, label: "Cashout", icon: Coins, hasParams: false },
  { key: "eachWay" as const, label: "Each-Way", icon: ArrowLeftRight, hasParams: false },
  { key: "mascarar" as const, label: "Mascarar", icon: EyeOff, hasParams: false },
];

export const emptyMaisOpcoes = (): MaisOpcoesData => ({
  tipster: "",
  comissao: false,
  bonusGanho: false,
  aoVivo: false,
  apostaGratuita: false,
  cashout: false,
  eachWay: false,
  mascarar: false,
  comentario: "",
});

export default function MaisOpcoes({ data, onChange }: MaisOpcoesProps) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof MaisOpcoesData>(key: K, value: MaisOpcoesData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-foreground">
          {open ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
          Mais opções
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4 animate-accordion-down">
        {/* Tipster */}
        <div className="rounded-lg bg-card border border-border p-4">
          <Label className="text-xs text-muted-foreground">Tipster</Label>
          <Select value={data.tipster} onValueChange={v => set("tipster", v)}>
            <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {TIPSTERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox options */}
        <div className="rounded-lg bg-card border border-border p-4 space-y-1">
          {checkboxItems.map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={data[item.key] as boolean}
                    onCheckedChange={(v) => set(item.key, !!v)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                {item.hasParams && (
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                    Parâmetros
                  </Button>
                )}
              </div>
              {item.key === "mascarar" && data.mascarar && (
                <p className="text-xs text-muted-foreground ml-10 pb-2 leading-relaxed">
                  Mascarar a aposta do balanço (máximo 48 horas e status 'Pendente').
                  Você pode tornar a aposta visível a qualquer momento, mudando seu estado
                  (Todos exceto 'Esperando').
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Comentário */}
        <div className="rounded-lg bg-card border border-border p-4">
          <Label className="text-xs text-muted-foreground">Comentário</Label>
          <Textarea
            value={data.comentario}
            onChange={e => set("comentario", e.target.value)}
            placeholder="Adicionar observações da aposta"
            className="mt-1 bg-background min-h-[80px]"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
