import { useState } from 'react'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { ProductMetadata } from '../data/schema'
import { Button } from '@/components/custom/button'

import { Category } from '../data/schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FetchProductsParams {
  page?: number
  limit?: number
  category?: string
  name?: string
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  metadata: ProductMetadata | null
  categoryNameFilter?: Category
  nameFilter?: string
  fetchProducts: (
    params: FetchProductsParams
  ) => Promise<{ products: TData[]; metadata: ProductMetadata }>
}

export function DataTablePagination<TData>({
  table,
  metadata,
  categoryNameFilter,
  nameFilter,
  fetchProducts,
}: DataTablePaginationProps<TData>) {
  const handlePageSizeChange = async (newPageSize: string) => {
    table.setPageSize(Number(newPageSize))
    await fetchProducts({
      limit: Number(newPageSize),
      page: 1,
      category: categoryNameFilter?.name,
      name: nameFilter,
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
              fetchProducts({
                page: 1,
                category: categoryNameFilter?.name,
                name: nameFilter,
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
              fetchProducts({
                page: metadata?.prevPage,
                category: categoryNameFilter?._id,
                name: nameFilter,
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
              fetchProducts({
                page: metadata?.nextPage,
                category: categoryNameFilter?._id,
                name: nameFilter,
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
              fetchProducts({
                page: metadata?.totalPages,
                category: categoryNameFilter?._id,
                name: nameFilter,
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
