import { createContext, useContext } from "react"

interface AuthContextType {
  me: any
  loading: boolean
  error: any
  refetch: any
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
