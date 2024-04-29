import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { categorySchema } from '../data/schema'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  updateCategory: (updatedCategory: TData) => void
  deleteCategory: (deletedCategory: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  updateCategory,
  deleteCategory,
}: DataTableRowActionsProps<TData>) {
  const category = categorySchema.parse(row.original)
  const [categoryName, setCategoryName] = useState(category.name)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setError] = useState('')

  useEffect(() => {
    if (!openEditDialog) {
      setCategoryName(category.name)
      setError('')
    }
  }, [openEditDialog, category, errorMessage])
  useEffect(() => {
    if (!openDeleteDialog) {
      setError('')
    }
  }, [openDeleteDialog, errorMessage])
  useEffect(() => {
    console.log('Current error message:', errorMessage)
  }, [errorMessage])

  const handleEditCategory = async () => {
    try {
      setIsLoading(true)
      if (categoryName === category.name) {
        setOpenEditDialog(false)
        return
      }
      const response = await axios.put(
        `http://localhost:3000/categories/${category._id}`,
        {
          name: categoryName,
        }
      )
      if (response.status !== 200) {
        setError(response.data.error)
        setIsLoading(false)
      } else {
        updateCategory(response.data)
        setIsLoading(false)
        setOpenEditDialog(false)
      }
    } catch (error) {
      setError('An Error occurred while updating')
      console.error('Failed to update category:', error)
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async () => {
    try {
      setIsLoading(true)
      const response = await axios.delete(
        `http://localhost:3000/categories/${category._id}`
      )
      if (response.status !== 200) {
        setError(response.data.error)
        setIsLoading(false)
      } else {
        deleteCategory(response.data)
        setIsLoading(false)
        setOpenDeleteDialog(false)
      }
    } catch (error) {
      setError('An Error occurred while deleting')
      console.error('Failed to delete category:', error)
      setIsLoading(false)
      console.log('hi error')
      console.log(errorMessage)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          {errorMessage && (
            <h1 className='pl-11 text-xs text-red-500'>{errorMessage}</h1>
          )}

          <DialogFooter>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            Are you sure you want to delete this category?
          </div>
          {errorMessage && (
            <h1 className='pl-11 text-xs text-red-500'>{errorMessage}</h1>
          )}
          <DialogFooter>
            <Button variant='ghost' onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory} disabled={isLoading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
