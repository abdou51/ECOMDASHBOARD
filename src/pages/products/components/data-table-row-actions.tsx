import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/custom/button'
import { useToast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { productSchema } from '../data/schema'
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
  updateProduct: (updatedCategory: TData) => void
  deleteProduct: (deletedCategory: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  updateProduct,
  deleteProduct,
}: DataTableRowActionsProps<TData>) {
  // Toast Hook :
  const { toast } = useToast()

  // Product State
  const product = productSchema.parse(row.original)
  const [productName, setProductName] = useState(product.engName)

  // Edit and Delete Dialogs States
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!openEditDialog) {
      setProductName(product.engName)
    }
  }, [openEditDialog, product])
  const handleEditCategory = async () => {
    try {
      setIsLoading(true)
      if (productName === product.engName) {
        setOpenEditDialog(false)
        return
      }
      const response = await axios.put(
        `http://localhost:3000/categories/${product._id}`,
        {
          name: productName,
        }
      )
      if (response.status !== 200) {
        setIsLoading(false)
      } else {
        updateProduct(response.data)
        setIsLoading(false)
        setOpenEditDialog(false)
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true)
      const response = await axios.put(
        `http://localhost:3000/products/${product._id}`,
        {
          isDrafted: true,
        }
      )
      if (response.status !== 200) {
        setIsLoading(false)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error deleting product. Please try again.',
        })
      } else {
        deleteProduct(response.data)
        setIsLoading(false)
        setOpenDeleteDialog(false)
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'Product Deleted Successfully',
        })
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      setIsLoading(false)
      setOpenDeleteDialog(false)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error deleting product. Please try again.',
      })
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
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className='col-span-3'
              />
            </div>
          </div>

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
            Are you sure you want to delete the product named '{product.engName}
            ' ?
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteProduct} disabled={isLoading}>
              {isLoading ? (
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                'delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
