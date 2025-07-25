import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const isIndeterminate = value == null

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full bg-primary-500 flex-1 transition-all rounded-full",
          isIndeterminate
            ? "absolute left-0 w-1/3 animate-indeterminate"
            : "relative w-full"
        )}
        style={
          isIndeterminate
            ? undefined
            : { transform: `translateX(-${100 - value}%)` }
        }
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
