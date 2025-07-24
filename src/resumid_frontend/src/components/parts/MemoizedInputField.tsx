import { HTMLInputTypeAttribute, ReactNode, useEffect, useRef, useState } from "react";

import { Input } from "../ui/input";
import { X } from "lucide-react";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface MemoizedSearchInputProps {
  id: string;
  startIcon?: ReactNode,
  placeholder?: string;
  type?: HTMLInputTypeAttribute
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  fullWidth?: boolean;
  className?: string;
}

const inputVariants = cva("relative", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-fit",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

export default function MemoizedInputField({
  id,
  startIcon,
  placeholder,
  value,
  onChange,
  className,
  debounce = 500,
  fullWidth = false,
}: MemoizedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const timeoutRef = useRef<number | null>(null);

  const onDebouncedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onChange(newValue);
    }, debounce);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn(inputVariants({ fullWidth }))}>
      {startIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph w-4 h-4 pointer-events-none">
          {startIcon}
        </span>
      )}
      {typeof localValue === "string" && localValue.trim() !== "" && (
        <X onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph w-4 h-4 cursor-pointer" />
      )}

      <Input
        onChange={onDebouncedChange}
        value={localValue}
        id={id}
        type="text"
        placeholder={placeholder}
        className={cn("font-normal", startIcon ? "pl-9" : "", className)}
      />
    </div>
  );
}
