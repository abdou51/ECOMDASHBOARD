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
import { useToast } from '@/components/ui/use-toast'
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
  const { toast } = useToast()

  const category = categorySchema.parse(row.original)
  const [categoryEngName, setCategoryEngName] = useState(category.engName)
  const [categoryFrName, setCategoryFrName] = useState(category.frName)
  const [categoryArName, setCategoryArName] = useState(category.arName)

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!openEditDialog) {
      setCategoryEngName(category.engName)
      setCategoryFrName(category.frName)
      setCategoryArName(category.arName)
    }
  }, [openEditDialog, category])

  const handleEditCategory = async () => {
    try {
      setIsLoading(true)
      // Check if category names have changed; if not, no need to make a PUT request.
      if (
        categoryEngName === category.engName &&
        categoryFrName === category.frName &&
        categoryArName === category.arName
      ) {
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'No changes made.',
        })
        return
      }
      const response = await axios.put(
        `http://localhost:3000/categories/${category._id}`,
        {
          engName: categoryEngName,
          frName: categoryFrName,
          arName: categoryArName,
        }
      )
      if (response.status !== 200) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error updating category. Please try again.',
        })
      } else {
        updateCategory(response.data)
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'Category updated successfully.',
        })
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error updating category. Please try again.',
      })
    } finally {
      setIsLoading(false)
      setOpenEditDialog(false)
    }
  }
  const handleDeleteCategory = async () => {
    try {
      setIsLoading(true)
      const response = await axios.delete(
        `http://localhost:3000/categories/${category._id}`
      )

      if (response.status === 200) {
        deleteCategory(response.data)
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'Category Deleted Successfully',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error deleting Category. Please try again.',
        })
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setIsLoading(false)
      setOpenDeleteDialog(false)
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
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                English Name
              </Label>
              <Input
                id='name'
                value={categoryEngName}
                onChange={(event) => setCategoryEngName(event.target.value)}
                className='col-span-3'
              />
              <Label htmlFor='name' className='text-right'>
                French Name
              </Label>
              <Input
                id='name'
                value={categoryFrName}
                onChange={(event) => setCategoryFrName(event.target.value)}
                className='col-span-3'
              />
              <Label htmlFor='name' className='text-right'>
                Arabic Name
              </Label>
              <Input
                id='name'
                value={categoryArName}
                onChange={(event) => setCategoryArName(event.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditCategory}
              disabled={
                isLoading ||
                !categoryArName ||
                !categoryEngName ||
                !categoryFrName
              }
            >
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
