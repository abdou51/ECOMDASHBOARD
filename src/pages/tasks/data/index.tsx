import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { fetchUsers } from './data/api'
import { useState, useEffect } from 'react'
import { User } from './data/schema'

export default function Tasks() {
  const testData = [{ id: 1, email: 'test@example.com' }] // Simple test data
  const testColumns = [
    { accessorKey: 'email', cell: (info) => info.getValue() },
  ] // Simple column definition
  const [users, setUsers] = useState<User[]>([]) // State to hold the fetched user data

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('Loading users')
        const fetchedUsers = await fetchUsers()
        setUsers(fetchedUsers) // Set the fetched data into state
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    loadUsers()
  }, [])
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={users} columns={columns} />
          {/* <DataTable data={testData} columns={testColumns} /> */}
        </div>
      </LayoutBody>
    </Layout>
  )
}
