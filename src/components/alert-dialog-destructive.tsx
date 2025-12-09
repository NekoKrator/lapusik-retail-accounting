"use client";

import { TriangleAlertIcon } from "lucide-react";
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

type ResponsiveAlertDialogProps = {
  title: string;
  description: string;
  applyButtonName: string;
  onDelete: () => Promise<unknown>;
  trigger: React.ReactNode;
};

export function AlertDialogDestructive({
  title,
  description,
  applyButtonName,
  onDelete,
  trigger,
}: ResponsiveAlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="overflow-hidden">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlertIcon className="size-6 text-destructive" />
          </div>
          <AlertDialogTitle
            className="line-clamp-3 overflow-hidden text-ellipsis"
            title={title}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
