import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-inter ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 disabled:cursor-not-allowed", {
  variants: {
    variant: {
      default: "bg-primary-500 text-white hover:bg-primary-500/90 font-semibold",
      destructive:
        "bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 font-semibold",
      "secondary-destructive":
        "bg-[#FFDADA] text-[#C92F2F] hover:bg-[#F1C9C9] font-medium",
      outline:
        "border border-neutral-200 bg-white text-paragraph hover:bg-secondary-900 font-medium",
      secondary:
        "bg-secondary-900 text-paragraph hover:bg-secondary-800/60 font-medium",
      gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-500/90 hover:to-accent-500/90 font-medium",
      ghost: "hover:bg-secondary-900 text-paragraph font-medium",
      link: "text-paragraph underline-offset-8 hover:underline",
      blue: "bg-[#215ADE] text-white hover:bg-[#215ADE]/90 font-semibold",  
    },
    size: {
      default: "h-10 px-4 py-2 text-sm [&_svg]:w-4 [&_svg]:h-4",
      sm: "h-9 rounded-md px-3 text-sm [&_svg]:w-4 [&_svg]:h-4",
      lg: "h-12 rounded-md px-6 [&_svg]:w-6 [&_svg]:h-6",
      icon: "h-10 w-10 [&_svg]:w-8 [&_svg]:h-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
}
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
