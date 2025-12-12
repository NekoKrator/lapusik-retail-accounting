import {
  BanknoteArrowUp,
  Briefcase,
  ChevronRight,
  Sheet,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Робочі зміни",
    url: "/admin/tables/shifts",
    icon: Briefcase,
  },
  {
    title: "Постачальники",
    url: "/admin/tables/suppliers",
    icon: Truck,
  },
  {
    title: "Боржники",
    url: "/admin/tables/debtors",
    icon: Users,
  },
  {
    title: "Надходження",
    url: "/admin/tables/additional-income",
    icon: BanknoteArrowUp,
  },
  {
    title: "Витрати",
    url: "/admin/tables/expenses",
    icon: TrendingDown,
  },
];

export default function TablesMenuItem() {
  return (
    <Collapsible className="group/collapsible" defaultOpen>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Sheet className="size-4" />
              <span>Таблиці</span>
            </div>

            <ChevronRight className='shrink-0 transition-transform [[data-state="open"]>&]:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
