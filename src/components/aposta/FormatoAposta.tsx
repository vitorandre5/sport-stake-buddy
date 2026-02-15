import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Formato = "simples" | "back" | "lay";

interface FormatoApostaProps {
  formato: Formato;
  onFormatoChange: (f: Formato) => void;
  multipla: boolean;
  onMultiplaChange: (v: boolean) => void;
}

export default function FormatoAposta({ formato, onFormatoChange, multipla, onMultiplaChange }: FormatoApostaProps) {
  const options: { value: Formato; label: string }[] = [
    { value: "simples", label: "Simples" },
    { value: "back", label: "A favor (Back)" },
    { value: "lay", label: "Contra (Lay)" },
  ];

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Formato da aposta</h3>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Escolhas múltiplas</Label>
            <Switch checked={multipla} onCheckedChange={onMultiplaChange} />
          </div>
        </div>
        <div className="flex gap-2">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onFormatoChange(opt.value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                formato === opt.value
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
