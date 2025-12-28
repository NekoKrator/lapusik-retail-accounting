"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ResponsiveAlertDialogProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  applyButtonName: string;
  onDelete: () => Promise<unknown>;
  tooltipMessage?: string;
  trigger?: React.ReactNode;
};

export function AlertDialogDestructive({
  title,
  description,
  applyButtonName,
  onDelete,
  tooltipMessage,
  trigger,
  ...props
}: ResponsiveAlertDialogProps & React.ComponentProps<typeof AlertDialog>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTooltipAllowed, setIsTooltipAllowed] = useState(true);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog onOpenChange={() => setIsTooltipAllowed(false)} {...props}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild onMouseEnter={() => setIsTooltipAllowed(true)}>
          <AlertDialogTrigger asChild>
            {trigger ?? (
              <Button
                className="h-9 w-9 text-muted-foreground/70 hover:bg-red-50 hover:text-destructive"
                type="button"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            )}
          </AlertDialogTrigger>
        </TooltipTrigger>
        {tooltipMessage && isTooltipAllowed && (
          <TooltipContent>{tooltipMessage}</TooltipContent>
        )}
      </Tooltip>
      <AlertDialogContent className="gap-16">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Скасувати</AlertDialogCancel>

          <Button
            className="relative has-[>svg]:px-4"
            disabled={isLoading}
            onClick={handleDelete}
            variant="destructive"
          >
            <p className={isLoading ? "invisible" : "visible"}>
              {applyButtonName}
            </p>
            {isLoading && (
              <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
