'use client'

import { createContext, useContext, useState } from 'react'
import AuthService from '@/services/auth.service'

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ user, children }: { user: any; children: React.ReactNode }) => {
  const [_user, setUser] = useState<any>(user)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user)

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
    <AuthContext.Provider value={{ user: _user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
