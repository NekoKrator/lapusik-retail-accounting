import type React from "react";
import { useState } from "react";
import {
  Dialog as DialogComponent,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ResponsiveDialogProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  tooltipMessage?: string;
};

export function Dialog({
  title,
  description,
  trigger,
  children,
  tooltipMessage,
  ...props
}: ResponsiveDialogProps & React.ComponentProps<typeof DialogComponent>) {
  const [isTooltipAllowed, setIsTooltipAllowed] = useState(true);

  return (
    <DialogComponent onOpenChange={() => setIsTooltipAllowed(false)} {...props}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild onMouseEnter={() => setIsTooltipAllowed(true)}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </TooltipTrigger>
        {tooltipMessage && isTooltipAllowed && (
          <TooltipContent>{tooltipMessage}</TooltipContent>
        )}
      </Tooltip>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle asChild>{title}</DialogTitle>
          {description && (
            <DialogDescription asChild>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogComponent>
  );
}
