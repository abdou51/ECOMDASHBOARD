import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { ProductMetadata } from '../data/schema'
import { useState, useEffect } from 'react'
import { fetchCategories } from '../../categories/data/api'
import { Category } from '../../categories/data/schema'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface FetchProductsParams {
  page?: number
  limit?: number
  category?: string
  name?: string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setCategoryNameFilter: (category: Category) => void
  categoryNameFilter: Category
  nameFilter: string
  setNameFilter: (name: string) => void
  fetchProducts: (
    params: FetchProductsParams
  ) => Promise<{ products: TData[]; metadata: ProductMetadata }>
}

export function DataTableToolbar<TData>({
  table,
  fetchProducts,
  categoryNameFilter,
  setCategoryNameFilter,
  nameFilter,
  setNameFilter,
}: DataTableToolbarProps<TData>) {
  // Data state
  const [categories, setCategories] = useState<Category[]>([])

  // Ui logic State
  const [open, setOpen] = useState(false)

  // filter products by name function
  const filterProductsByName = async (event: React.FormEvent) => {
    event.preventDefault()
    fetchProducts({
      page: 1,
      limit: 10,
      name: nameFilter,
      category: categoryNameFilter._id,
    })
  }

  // Load Categories function and use Effect
  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <form onSubmit={filterProductsByName}>
          <Input
            placeholder='Filter Products By Name ...'
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
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
              {categoryNameFilter.engName || 'Filter By Category...'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setCategoryNameFilter({} as Category)
                    setOpen(false)
                    fetchProducts({
                      name: nameFilter,
                    })
                  }}
                >
                  All
                </CommandItem>
              </CommandGroup>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category._id}
                    onSelect={() => {
                      setCategoryNameFilter(category)
                      setOpen(false)
                      fetchProducts({
                        category: category._id,
                        name: nameFilter,
                      })
                    }}
                  >
                    {category.engName}
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
