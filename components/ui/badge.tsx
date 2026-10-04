import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-primary", className)}
      {...props}
    />
  );
}
