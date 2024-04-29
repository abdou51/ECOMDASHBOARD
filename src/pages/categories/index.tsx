import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { fetchCategories } from './data/api'
import { Category } from './data/schema'
import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableRowActions } from './components/data-table-row-actions'
import { Button } from '../../components/custom/button'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DeliveryPricing() {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'engName',
      header: ({ column }) => (
        <DataTableColumnHeader
          className='w-96'
          column={column}
          title='English Name'
        />
      ),
      cell: ({ row }) => <div>{row.getValue('engName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'frName',
      header: ({ column }) => (
        <DataTableColumnHeader
          className='w-96'
          column={column}
          title='French Name'
        />
      ),
      cell: ({ row }) => <div>{row.getValue('frName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'arName',
      header: ({ column }) => (
        <DataTableColumnHeader
          className='w-96'
          column={column}
          title='Arabic Name'
        />
      ),
      cell: ({ row }) => <div>{row.getValue('arName')}</div>,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
        />
      ),
    },
  ]
  const updateCategory = (updatedCategory: Category) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      )
    )
  }
  const deleteCategory = (deletedCategory: Category) => {
    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category._id !== deletedCategory._id
      )
    )
  }

  // data state
  const [categories, setCategories] = useState<Category[]>([])

  // api state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ui state
  const [openDialog, setOpenDialog] = useState(false)

  // single state
  const [categoryEnglishName, setCategoryEnglishName] = useState('')
  const [categoryFrenchName, setCategoryFrenchName] = useState('')
  const [categoryArabicName, setCategoryArabicName] = useState('')

  useEffect(() => {
    if (!openDialog) {
      setCategoryEnglishName('')
      setCategoryFrenchName('')
      setCategoryArabicName('')
    }
  }, [openDialog, categoryEnglishName, categoryFrenchName, categoryArabicName])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async () => {
    try {
      console.log(categoryEnglishName)
      if (
        categoryEnglishName === '' &&
        categoryFrenchName === '' &&
        categoryArabicName === ''
      ) {
        return
      }
      const response = await axios.post(`http://localhost:3000/categories/`, {
        engName: categoryEnglishName,
        frName: categoryFrenchName,
        arName: categoryArabicName,
      })
      console.log('Update successful:', response.data)
      setCategories([response.data, ...categories])
      setOpenDialog(false)
    } catch (error) {
      console.error('Failed to update wilaya:', error)
    }
  }

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
              Here&apos;s a list of your Categories !
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
                <Button>ADD NEW CATEGORY</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='deskPrice'>English Name</Label>
                    <Input
                      id='name'
                      value={categoryEnglishName}
                      onChange={(event) =>
                        setCategoryEnglishName(event.target.value)
                      }
                      className='col-span-3'
                    />
                    <Label htmlFor='deskPrice'>French Name</Label>
                    <Input
                      id='name'
                      value={categoryFrenchName}
                      onChange={(event) =>
                        setCategoryFrenchName(event.target.value)
                      }
                      className='col-span-3'
                    />
                    <Label htmlFor='deskPrice'>Arabic Name</Label>
                    <Input
                      id='name'
                      value={categoryArabicName}
                      onChange={(event) =>
                        setCategoryArabicName(event.target.value)
                      }
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='submit'
                    onClick={handleSubmit}
                    disabled={
                      !categoryArabicName ||
                      !categoryEnglishName ||
                      !categoryFrenchName
                    }
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={categories}
            columns={columns}
            loading={loading}
            error={error}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
