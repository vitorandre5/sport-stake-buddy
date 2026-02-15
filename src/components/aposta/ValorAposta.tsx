import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ValorApostaProps {
  formato: string;
  valor: string;
  onValorChange: (v: string) => void;
  percentual: string;
  onPercentualChange: (v: string) => void;
}

export default function ValorAposta({ formato, valor, onValorChange, percentual, onPercentualChange }: ValorApostaProps) {
  const label = formato === "lay" ? "Contra (Lay)" : "A favor (Back)";

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Valor</h3>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Valor (R$)</Label>
            <Input type="number" step="0.01" value={valor} onChange={e => onValorChange(e.target.value)} placeholder="0.00" className="mt-1 bg-background" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">% capital</Label>
            <Input type="number" step="0.1" value={percentual} onChange={e => onPercentualChange(e.target.value)} placeholder="0.0" className="mt-1 bg-background" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
