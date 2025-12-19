// src/components/ui/progress.tsx
import * as React from "react";
import { cn } from "@/lib/utils/cn"; // Utility para unir clases de Tailwind

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

/**
 * Componente de barra de progreso simple con Tailwind CSS.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all duration-500 ease-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };