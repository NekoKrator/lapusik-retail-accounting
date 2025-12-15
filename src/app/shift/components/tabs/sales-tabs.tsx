"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SalesTab = {
  key: string;
  label: string;
  icon: React.ElementType;
  activeClass: string;
  count: number;
  disabled: boolean;
  content: React.ReactNode;
};

export function SalesTabs({ tabs }: { tabs: SalesTab[] }) {
  const [activeTab, setActiveTab] = useState("");

  return (
    <Tabs className="gap-4" value={activeTab}>
      <TabsList className="flex h-full w-full flex-col gap-4 bg-transparent p-0 lg:flex-row">
        {tabs.map(
          ({ key, label, icon: Icon, count, disabled, activeClass }) => (
            <TabsTrigger
              className={`h-12 w-full border shadow-sm ${activeClass}`}
              disabled={disabled}
              key={key}
              onClick={() => {
                setActiveTab((prev) => (prev === key ? "" : key));
              }}
              value={key}
            >
              <Icon />
              {label}
              <span>{count}</span>
            </TabsTrigger>
          )
        )}
      </TabsList>

      {tabs.map(({ key, content }) => (
        <TabsContent
          forceMount
          hidden={activeTab !== key}
          key={key}
          value={key}
        >
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
