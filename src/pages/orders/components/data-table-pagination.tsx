import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { OrderMetaData } from '../data/schema'
import { Button } from '@/components/custom/button'
import { FetchOrdersParams } from '../data/api'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  metadata: OrderMetaData | null
  statusFilter?: string
  multiFilter?: string
  fetchOrders: (
    params: FetchOrdersParams
  ) => Promise<{ orders: TData[]; metadata: OrderMetaData }>
}

export function DataTablePagination<TData>({
  table,
  metadata,
  statusFilter,
  multiFilter,
  fetchOrders,
}: DataTablePaginationProps<TData>) {
  const handlePageSizeChange = async (newPageSize: string) => {
    table.setPageSize(Number(newPageSize))
    await fetchOrders({
      limit: Number(newPageSize),
      page: 1,
      status: statusFilter,
      filter: multiFilter,
    })
  }
  return (
    <div className='flex items-center justify-between overflow-auto px-2'>
      <div className='hidden flex-1 text-sm text-muted-foreground sm:block'></div>
      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {metadata?.page} of {metadata?.totalPages}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() =>
              fetchOrders({
                page: 1,
                status: statusFilter,
                filter: multiFilter,
              })
            }
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() =>
              fetchOrders({
                page: metadata?.prevPage,
                status: statusFilter,
                filter: multiFilter,
              })
            }
            disabled={!metadata?.hasPrevPage}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() =>
              fetchOrders({
                page: metadata?.nextPage,
                status: statusFilter,
                filter: multiFilter,
              })
            }
            disabled={!metadata?.hasNextPage}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() =>
              fetchOrders({
                page: metadata?.totalPages,
                status: statusFilter,
                filter: multiFilter,
              })
            }
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
