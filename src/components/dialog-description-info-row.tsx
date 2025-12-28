import { cn } from "@/lib/utils";

export function DialogDescriptionInfoRow({
  label,
  value,
  className,
  ...props
}: {
  label: string;
  value: string;
} & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex justify-between gap-4", className)} {...props}>
      <p>{label}</p>
      <p className="text-right">{value}</p>
    </div>
  );
}
