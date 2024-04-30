import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { OrderMetaData } from '../data/schema'
import { useState } from 'react'

import { FetchOrdersParams } from '../data/api'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setStatusFilter: (status: string) => void
  statusFilter: string
  multiFilter: string
  setMultiFilter: (multiFilter: string) => void
  fetchOrders: (
    params: FetchOrdersParams
  ) => Promise<{ orders: TData[]; metadata: OrderMetaData }>
}

export function DataTableToolbar<TData>({
  table,
  fetchOrders,
  statusFilter,
  setStatusFilter,
  multiFilter,
  setMultiFilter,
}: DataTableToolbarProps<TData>) {
  // Data state
  const statuses = [
    'pending',
    'confirmed',
    'cancelled',
    'shipped',
    'delivered',
    'returned',
  ]

  // Ui logic State
  const [open, setOpen] = useState(false)

  // filter products by name function
  const filterOrdersByFilter = async (event: React.FormEvent) => {
    event.preventDefault()
    fetchOrders({
      page: 1,
      limit: 10,
      status: statusFilter,
      filter: multiFilter,
    })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <form onSubmit={filterOrdersByFilter}>
          <Input
            placeholder='Filter Orders  (reference , name , wilaya , phones )'
            value={multiFilter}
            onChange={(event) => setMultiFilter(event.target.value)}
            className='h-8 w-[350px] lg:w-[350px]'
          />
        </form>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
            >
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) ||
                'Filter By Status...'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setStatusFilter('')
                    setOpen(false)
                    fetchOrders({
                      filter: multiFilter,
                    })
                  }}
                >
                  All
                </CommandItem>
              </CommandGroup>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => {
                      setStatusFilter(status)
                      setOpen(false)
                      fetchOrders({
                        status: status,
                        filter: multiFilter,
                      })
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
