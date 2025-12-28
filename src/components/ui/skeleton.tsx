import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-md bg-muted-foreground/20 dark:bg-accent", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
