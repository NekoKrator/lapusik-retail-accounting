import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type ResponsiveTooltipProps = {
  message?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function ResponsiveTooltip({
  message,
  children,
  className,
  disabled,
  ...props
}: ResponsiveTooltipProps & React.ComponentProps<typeof Tooltip>) {
  if (!message || disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={cn("wrap-break-word max-h-64 max-w-xs", className)}
      >
        {message}
      </TooltipContent>
    </Tooltip>
  );
}
