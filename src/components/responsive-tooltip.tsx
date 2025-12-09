import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ResponsiveTooltipProps = {
  message: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function ResponsiveTooltip({
  message,
  children,
  className,
  ...props
}: ResponsiveTooltipProps & React.ComponentProps<typeof Tooltip>) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip onOpenChange={setOpen} open={open} {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn(
          "wrap-break-word max-h-64 max-w-xs overflow-y-auto",
          className
        )}
      >
        {message}
      </TooltipContent>
    </Tooltip>
  );
}
