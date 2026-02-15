import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Target,
  History,
  Settings,
  TrendingUp,
  ChevronDown,
  Building2,
  Users,
  Tag,
  Trophy,
  ListChecks,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Bancas", url: "/bancas", icon: Wallet },
  { title: "Nova Aposta", url: "/apostas/nova", icon: Target },
  { title: "Histórico", url: "/historico", icon: History },
];

const configItems = [
  { title: "Casas de apostas", url: "/config/casas-apostas", icon: Building2 },
  { title: "Tipsters", url: "/config/tipsters", icon: Users },
  { title: "Categorias", url: "/config/categorias", icon: Tag },
  { title: "Competições", url: "/config/competicoes", icon: Trophy },
  { title: "Tipos de apostas", url: "/config/tipos-apostas", icon: ListChecks },
];

export function AppSidebar() {
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">BetTracker</h1>
            <p className="text-[10px] text-muted-foreground">Gestão de Apostas</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuração accordion */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
              <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground w-full">
                <Settings className="w-4 h-4" />
                <span className="flex-1 text-left">Configuração</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", configOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <SidebarMenu className="pl-4 mt-1">
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Configurações</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
