import { create } from "zustand"

interface User {
  id: number
  name: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLogin: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLogin: false,
  setUser: (user) => set({ user, isLogin: !!user }),
  logout: () => set({ user: null, isLogin: false }),
}))
