export interface ConfigItem {
  id: string;
  nome: string;
  criadoEm: string;
}

type ConfigKey = 'casas_apostas' | 'tipsters' | 'categorias' | 'competicoes' | 'tipos_apostas';

function getItems(key: ConfigKey): ConfigItem[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(key: ConfigKey, items: ConfigItem[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function getConfigItems(key: ConfigKey): ConfigItem[] {
  return getItems(key);
}

export function addConfigItem(key: ConfigKey, nome: string): ConfigItem {
  const items = getItems(key);
  const item: ConfigItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    nome,
    criadoEm: new Date().toISOString(),
  };
  items.push(item);
  saveItems(key, items);
  return item;
}

export function updateConfigItem(key: ConfigKey, id: string, nome: string): void {
  const items = getItems(key).map(i => i.id === id ? { ...i, nome } : i);
  saveItems(key, items);
}

export function deleteConfigItem(key: ConfigKey, id: string): void {
  saveItems(key, getItems(key).filter(i => i.id !== id));
}
