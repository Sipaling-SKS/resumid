import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Highlight = ({ className, children, ...props }: ButtonProps) => {
  return (
    <span className={cn("text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500", className)} {...props}>
      {children}
    </span>
  )
}

export default Highlight;