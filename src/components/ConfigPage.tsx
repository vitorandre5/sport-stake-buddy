import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreVertical, Pencil, Trash2, LayoutList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getConfigItems, addConfigItem, updateConfigItem, deleteConfigItem, ConfigItem } from "@/lib/configStorage";

interface ConfigPageProps {
  title: string;
  singular: string;
  storageKey: 'casas_apostas' | 'tipsters' | 'categorias' | 'competicoes' | 'tipos_apostas';
}

export default function ConfigPage({ title, singular, storageKey }: ConfigPageProps) {
  const [items, setItems] = useState<ConfigItem[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigItem | null>(null);
  const [inputValue, setInputValue] = useState("");

  const reload = () => setItems(getConfigItems(storageKey));
  useEffect(() => { reload(); }, [storageKey]);

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (!inputValue.trim()) return;
    if (editingItem) {
      updateConfigItem(storageKey, editingItem.id, inputValue.trim());
    } else {
      addConfigItem(storageKey, inputValue.trim());
    }
    setDialogOpen(false);
    setInputValue("");
    setEditingItem(null);
    reload();
  };

  const handleEdit = (item: ConfigItem) => {
    setEditingItem(item);
    setInputValue(item.nome);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteConfigItem(storageKey, id);
    reload();
  };

  const openAdd = () => {
    setEditingItem(null);
    setInputValue("");
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5 max-w-3xl animate-fade-in">
      {/* Hero card */}
      <Card className="bg-gradient-to-br from-card to-secondary/30 border-border overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">Crie sua lista de {title.toLowerCase()}.</p>
            <Button onClick={openAdd} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar {singular}
            </Button>
          </div>
          <LayoutList className="h-16 w-16 text-primary/20" />
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Pesquisar ${singular.toLowerCase()}`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <Card key={item.id} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground truncate">{item.nome}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhum registro encontrado.
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar" : "Adicionar"} {singular}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder={`Nome do ${singular.toLowerCase()}`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            className="bg-background"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
