import React, { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface RequireAuthProps {
  children: ReactNode
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('jwt')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/users/verify', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('jwt')
          navigate('/login')
        }
      } catch (error) {
        console.error('Verification failed:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [navigate])

  if (isLoading) {
    return <div></div>
  }

  return isAuthenticated ? children : null
}

export default RequireAuth
