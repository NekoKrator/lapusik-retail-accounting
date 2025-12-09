import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./ui/item";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const resultItemVariants = cva("", {
  variants: {
    variant: {
      blue: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-600/20 dark:bg-blue-600/10",
      green:
        "border-green-200 bg-green-50 text-green-600 dark:border-green-600/20 dark:bg-green-600/10",
      red: "border-red-200 bg-red-50 text-red-600 dark:border-red-600/20 dark:bg-red-600/10",
      orange:
        "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-600/20 dark:bg-orange-600/10",
      indigo:
        "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-600/20 dark:bg-indigo-600/10",
      yellow:
        "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-600/20 dark:bg-yellow-600/10",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

type ResultItemProps = {
  value: string;
  label: string;
};

export function ResultItem({
  className,
  variant,
  value,
  label,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof resultItemVariants> &
  ResultItemProps) {
  return (
    <Item
      className={`h-23 ${cn(resultItemVariants({ variant, className }))}`}
      variant="outline"
      {...props}
    >
      <ItemContent className="overflow-y-auto">
        <ItemTitle className="font-bold text-2xl">
          <ScrollArea className="w-full">
            <p className="text-center">{value}</p>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ItemTitle>

        <ItemDescription className="text-center text-inherit">
          {label}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
