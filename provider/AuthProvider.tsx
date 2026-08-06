"use client"

import { AuthContext } from "@/context/AuthContext"
import { useMe } from "@/hooks/useMe"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { me, loading, error, refetch } = useMe()

  return (
    <AuthContext.Provider
      value={{
        me,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
