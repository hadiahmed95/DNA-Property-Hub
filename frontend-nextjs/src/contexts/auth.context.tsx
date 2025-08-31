'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import AuthService from '@/services/auth.service'

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setUser(JSON.parse(user))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string, remember?: boolean) => {
    const response = await AuthService.login({ email, password, remember_me: remember })
    setUser(response.user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
