import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('jwt')

    if (!token) {
      navigate('/login') // Ensures the rest of the application knows auth check is done
    } else {
      // Send POST request to /verify using token
      fetch('http://localhost:3000/users/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            return
          } else {
            localStorage.removeItem('jwt')
            navigate('/login')
          }
        })
        .catch((error) => {
          console.error('Verification failed:', error)
          navigate('/login')
        })
    }
  }, [navigate])

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Outlet />
      </main>
    </div>
  )
}
