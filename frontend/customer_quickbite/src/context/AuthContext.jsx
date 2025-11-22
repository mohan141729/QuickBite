import React, { createContext, useEffect, useState, useContext } from "react"
import { registerCustomer, loginCustomer, logoutCustomer } from "../api/auth"
import { FetchUserProfile, UpdateUserProfile } from "../api/profile"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await FetchUserProfile()
        setUser(res?.data || null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const register = async (data) => {
    const res = await registerCustomer(data)
    setUser(res?.data?.user || res?.data || null)
    return res
  }

  const login = async (data) => {
    const res = await loginCustomer(data)
    setUser(res?.data?.user || res?.data || null)
    return res
  }

 const logout = async () => {
  try {
    await logoutCustomer() // backend clears cookie
    setUser(null)
  } catch (err) {
    console.error("Logout failed:", err)
  }
}


const updateProfile = async (data) => {
  try {
    const updatedData = await UpdateUserProfile(data)
    const updatedUser = updatedData.user || updatedData

    setUser((prev) => ({ ...prev, ...updatedUser }))
    return updatedData
  } catch (err) {
    console.error("Update profile failed:", err)
    throw err
  }
}



  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
