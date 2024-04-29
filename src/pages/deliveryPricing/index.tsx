import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { fetchWilayas } from './data/api'
import { useState, useEffect } from 'react'
import { Wilaya } from './data/schema'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableRowActions } from './components/data-table-row-actions'

export default function DeliveryPricing() {
  const columns: ColumnDef<Wilaya>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'deskPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Desk Price' />
      ),
      cell: ({ row }) => <div>{row.getValue('deskPrice')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'homePrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Home Price' />
      ),
      cell: ({ row }) => <div>{row.getValue('homePrice')}</div>,
      enableSorting: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} updateWilaya={updateWilaya} />
      ),
    },
  ]
  const updateWilaya = (updatedWilaya: Wilaya) => {
    setWilayas((currentWilayas) =>
      currentWilayas.map((wilaya) =>
        wilaya._id === updatedWilaya._id ? updatedWilaya : wilaya
      )
    )
  }
  const [wilayas, setWilayas] = useState<Wilaya[]>([]) // State to hold the fetched user data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadWilayas = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedWilayas = await fetchWilayas()
      setWilayas(fetchedWilayas)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWilayas()
  }, [])

  return (
    <Layout>
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
              Here&apos;s a list of your Shipping Prices !
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={wilayas}
            columns={columns}
            loading={loading}
            error={error}
            updateWilaya={updateWilaya}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
