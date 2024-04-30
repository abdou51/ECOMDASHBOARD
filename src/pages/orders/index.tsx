import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { fetchOrders, FetchOrdersParams } from './data/api'
import { useState, useEffect } from 'react'
import { Order, OrderMetaData } from './data/schema'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableRowActions } from './components/data-table-row-actions'

export default function OrderPage() {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Reference' />
      ),
      cell: ({ row }) => <div>{row.getValue('reference')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Client Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Address' />
      ),
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'wilaya',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Wilaya' />
      ),
      cell: ({ row }) => <div>{row.getValue('wilaya')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'commune',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Commune' />
      ),
      cell: ({ row }) => <div>{row.getValue('commune')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'phoneNumber1',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phone Number 1' />
      ),
      cell: ({ row }) => <div>{row.getValue('phoneNumber1')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'phoneNumber2',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phone Number 2' />
      ),
      cell: ({ row }) => <div>{row.getValue('phoneNumber2')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Total' />
      ),
      cell: ({ row }) => <div>{row.getValue('total')} Dzd</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => (
        <DataTableRowActions row={row} updateOrder={updateOrder} />
      ),
    },
  ]
  const updateOrder = (updatedOrder: Order) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    )
  }
  // api functionnality state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // data api state
  const [orders, setOrders] = useState<Order[]>([])
  const [metadata, setMetadata] = useState<OrderMetaData | null>(null)

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { orders: fetchedOrders, metadata: fetchedMetadata } =
        await fetchOrders()
      setOrders(fetchedOrders)
      setMetadata(fetchedMetadata)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch orders', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }
  useEffect(() => {
    loadOrders()
  }, [])
  const handleFetchOrders = async (params: FetchOrdersParams) => {
    setLoading(true)
    try {
      const { orders, metadata } = await fetchOrders(params)
      setOrders(orders)
      setMetadata(metadata)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching Orders:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }
  return (
    <>
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
              <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
              <p className='text-muted-foreground'>
                {metadata?.totalDocs} Order(s) Found !
              </p>
            </div>
            <div className='flex items-center space-x-2'></div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <DataTable
              data={orders}
              metadata={metadata}
              columns={columns}
              loading={loading}
              error={error}
              fetchOrders={handleFetchOrders}
            />
          </div>
        </LayoutBody>
      </Layout>
    </>
  )
}
