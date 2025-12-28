"use client";

import {
  BanknoteArrowUp,
  Briefcase,
  ChevronRight,
  type LucideProps,
  Package,
  Sheet,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
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
import { type TableKey, useTables } from "@/context/tables-context";

const items: {
  title: string;
  key: TableKey;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  { title: "Робочі зміни", key: "shifts", icon: Briefcase },
  { title: "Постачальники", key: "suppliers", icon: Truck },
  { title: "Поставки", key: "supplier-deliveries", icon: Package },
  { title: "Боржники", key: "debtors", icon: Users },
  { title: "Надходження", key: "additional-income", icon: BanknoteArrowUp },
  { title: "Витрати", key: "expenses", icon: TrendingDown },
];

export default function TablesMenuItem() {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveTable, activeTable } = useTables();

  const handleClick = (key: TableKey) => {
    setActiveTable(key);

    if (pathname !== "/admin/tables") {
      router.push("/admin/tables");
    }
  };

  return (
    <Collapsible defaultOpen>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Sheet className="size-4" />
              <span>Таблиці</span>
            </div>
            <ChevronRight className='transition-transform [[data-state="open"]>&]:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.key}>
                <SidebarMenuButton
                  isActive={activeTable === item.key}
                  onClick={() => handleClick(item.key)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
