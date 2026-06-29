import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('trampo_user')
    if (saved) setProfessional(JSON.parse(saved))
    setLoading(false)
  }, [])

  function login(data) {
    setProfessional(data)
    localStorage.setItem('trampo_user', JSON.stringify(data))
  }

  function logout() {
    setProfessional(null)
    localStorage.removeItem('trampo_user')
  }

  return (
    <AuthContext.Provider value={{ professional, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
