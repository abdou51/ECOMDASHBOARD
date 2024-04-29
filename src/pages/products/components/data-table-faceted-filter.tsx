import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ProductMetadata } from '../data/schema'
interface FetchProductsParams {
  page?: number
  limit?: number
  category?: string
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    name: string
    _id: string
  }[]
  fetchProducts: (
    params: FetchProductsParams
  ) => Promise<{ products: TData[]; metadata: ProductMetadata }>
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  fetchProducts,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      const newSelectedIds = new Set(prev)
      if (newSelectedIds.has(categoryId)) {
        newSelectedIds.delete(categoryId)
      } else {
        newSelectedIds.add(categoryId)
      }
      return Array.from(newSelectedIds)
    })

    // Call fetchProducts after updating the state
    fetchProducts({ categoryIds: selectedCategoryIds })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selectedCategoryIds.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedCategoryIds.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {options
                  .filter((option) => selectedCategoryIds.includes(option._id))
                  .map((option) => (
                    <Badge
                      variant='secondary'
                      key={option._id}
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.name}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={`Filter by ${title}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option._id}
                  onSelect={() => toggleCategorySelection(option._id)}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selectedCategoryIds.includes(option._id)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50'
                    )}
                  >
                    <CheckIcon className='h-4 w-4' />
                  </div>
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedCategoryIds.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedCategoryIds([])
                      column.setFilterValue(undefined)
                      fetchProducts({ categoryIds: [] })
                    }}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
