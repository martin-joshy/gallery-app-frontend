import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
