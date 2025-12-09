"use client";

import type { VariantProps } from "class-variance-authority";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type ResponsiveAlertDialogProps<T> = {
  title: string;
  description: string;
  applyButtonName: string;
  applyButtonType: VariantProps<typeof Button>["variant"];
  onApply: () => Promise<T>;
  cancelButtonName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function ResponsiveAlertDialog<T>({
  title,
  description,
  applyButtonName,
  applyButtonType,
  onApply,
  cancelButtonName,
  isOpen,
  setIsOpen,
}: ResponsiveAlertDialogProps<T>) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="overflow-hidden">
          <AlertDialogTitle>
            <p
              className="line-clamp-3 overflow-hidden text-ellipsis"
              title={title}
            >
              {title}
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isApplying}>
            {cancelButtonName}
          </AlertDialogCancel>

          <Button
            className="relative has-[>svg]:px-4"
            disabled={isApplying}
            onClick={handleApply}
            variant={applyButtonType}
          >
            <span className={isApplying ? "invisible" : "visible"}>
              {applyButtonName}
            </span>
            {isApplying && (
              <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
