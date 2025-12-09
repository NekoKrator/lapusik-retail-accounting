import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ResponsiveDialogProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  trigger: React.ReactNode;
  children?: React.ReactNode;
  tooltipContent?: React.ReactNode;
};

export function DialogWithTooltip({
  title,
  description,
  trigger,
  children,
  tooltipContent,
  ...props
}: ResponsiveDialogProps & React.ComponentProps<typeof Dialog>) {
  const [isTooltipAllowed, setIsTooltipAllowed] = useState(true);

  return (
    <Dialog onOpenChange={() => setIsTooltipAllowed(false)} {...props}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild onMouseEnter={() => setIsTooltipAllowed(true)}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </TooltipTrigger>
        {isTooltipAllowed && <TooltipContent>{tooltipContent}</TooltipContent>}
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
