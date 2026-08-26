import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-md border bg-dark-400 px-3 py-2 text-sm text-light-200 placeholder:text-dark-600 focus-visible:outline-none focus-visible:border-primary/60 focus-visible:shadow-none disabled:cursor-not-allowed disabled:opacity-50 border-dark-500",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
