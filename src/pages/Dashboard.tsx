import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApostas, getBancas } from "@/lib/storage";
import { TrendingUp, TrendingDown, Target, Percent, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DashboardStats } from "@/types/betting";

function calcStats(): DashboardStats {
  const apostas = getApostas();
  const resolvidas = apostas.filter(a => a.resultado !== 'pendente');
  const ganhas = resolvidas.filter(a => a.resultado === 'ganhou' || a.resultado === 'cashout');
  const perdidas = resolvidas.filter(a => a.resultado === 'perdeu');
  const pendentes = apostas.filter(a => a.resultado === 'pendente');

  const lucroTotal = resolvidas.reduce((sum, a) => sum + a.lucro, 0);
  const totalStake = resolvidas.reduce((sum, a) => sum + a.stake, 0);
  const roi = totalStake > 0 ? (lucroTotal / totalStake) * 100 : 0;
  const taxaAcerto = resolvidas.length > 0 ? (ganhas.length / resolvidas.length) * 100 : 0;
  const oddMedia = resolvidas.length > 0 ? resolvidas.reduce((s, a) => s + a.odd, 0) / resolvidas.length : 0;
  const stakeMedia = resolvidas.length > 0 ? totalStake / resolvidas.length : 0;

  // Streak
  let streakAtual = 0;
  let maiorStreak = 0;
  let currentStreak = 0;
  const sorted = [...resolvidas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  for (const a of sorted) {
    if (a.resultado === 'ganhou' || a.resultado === 'cashout') {
      currentStreak++;
      maiorStreak = Math.max(maiorStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  if (sorted.length > 0) {
    streakAtual = 0;
    const lastResult = sorted[0]?.resultado;
    for (const a of sorted) {
      if (a.resultado === lastResult) streakAtual++;
      else break;
    }
    if (lastResult === 'perdeu') streakAtual = -streakAtual;
  }

  return {
    totalApostas: apostas.length,
    apostasGanhas: ganhas.length,
    apostasPerdidas: perdidas.length,
    apostasPendentes: pendentes.length,
    lucroTotal,
    roi,
    taxaAcerto,
    oddMedia,
    stakeMedia,
    streakAtual,
    maiorStreak,
  };
}

const COLORS = [
  'hsl(142, 71%, 45%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(265, 83%, 57%)',
];

export default function Dashboard() {
  const stats = useMemo(calcStats, []);
  const apostas = useMemo(() => getApostas(), []);
  const bancas = useMemo(() => getBancas(), []);

  // Evolution data
  const evolutionData = useMemo(() => {
    const sorted = [...apostas].filter(a => a.resultado !== 'pendente').sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    let acumulado = 0;
    return sorted.map(a => {
      acumulado += a.lucro;
      return { data: new Date(a.data).toLocaleDateString('pt-BR'), lucro: acumulado };
    });
  }, [apostas]);

  // Sport distribution
  const sportData = useMemo(() => {
    const map = new Map<string, number>();
    apostas.forEach(a => {
      map.set(a.esporte, (map.get(a.esporte) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [apostas]);

  const kpis = [
    { label: "Lucro/Prejuízo", value: `R$ ${stats.lucroTotal.toFixed(2)}`, icon: stats.lucroTotal >= 0 ? TrendingUp : TrendingDown, color: stats.lucroTotal >= 0 ? "text-success" : "text-destructive" },
    { label: "ROI", value: `${stats.roi.toFixed(1)}%`, icon: Percent, color: stats.roi >= 0 ? "text-success" : "text-destructive" },
    { label: "Taxa de Acerto", value: `${stats.taxaAcerto.toFixed(1)}%`, icon: Target, color: "text-info" },
    { label: "Total Apostas", value: stats.totalApostas.toString(), icon: BarChart3, color: "text-muted-foreground" },
    { label: "Odd Média", value: stats.oddMedia.toFixed(2), icon: DollarSign, color: "text-warning" },
    { label: "Streak", value: stats.streakAtual > 0 ? `+${stats.streakAtual}` : stats.streakAtual.toString(), icon: TrendingUp, color: stats.streakAtual >= 0 ? "text-success" : "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral das suas apostas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Evolução do Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            {evolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 18%, 18%)" />
                  <XAxis dataKey="data" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(222, 25%, 10%)', border: '1px solid hsl(222, 18%, 18%)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
                  />
                  <Line type="monotone" dataKey="lucro" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Registre apostas para ver o gráfico
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Por Esporte</CardTitle>
          </CardHeader>
          <CardContent>
            {sportData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sportData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {sportData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Sem dados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bancas Summary */}
      {bancas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Suas Bancas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bancas.map(banca => {
              const lucro = banca.saldoAtual - banca.saldoInicial;
              return (
                <Card key={banca.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: banca.cor }} />
                      <span className="font-medium text-sm text-foreground">{banca.nome}</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-foreground">
                      R$ {banca.saldoAtual.toFixed(2)}
                    </p>
                    <p className={`text-xs font-mono mt-1 ${lucro >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {lucro >= 0 ? '+' : ''}R$ {lucro.toFixed(2)} desde o início
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
