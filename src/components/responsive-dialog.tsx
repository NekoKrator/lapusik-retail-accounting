import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ResponsiveDialogProps = {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function ResponsiveDialog({
  children,
  title,
  isOpen,
  setIsOpen,
}: ResponsiveDialogProps) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
