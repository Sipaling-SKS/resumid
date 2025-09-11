import { createContext, useContext, useState } from "react"

const HeaderContext = createContext<{
  title: string
  setTitle: (t: string) => void
} | null>(null)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("Section Title")
  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const ctx = useContext(HeaderContext)
  if (!ctx) throw new Error("useHeader must be used within HeaderProvider")
  return ctx
}
