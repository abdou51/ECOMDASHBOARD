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

import { wilayaSchema } from '../data/schema'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  updateWilaya: (updatedWilaya: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  updateWilaya,
}: DataTableRowActionsProps<TData>) {
  const wilaya = wilayaSchema.parse(row.original)
  console.log('hello task')
  console.log(wilaya.deskPrice)
  const [deskPrice, setDeskPrice] = useState(wilaya.deskPrice)
  const [homePrice, setHomePrice] = useState(wilaya.homePrice)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (!openDialog) {
      setDeskPrice(wilaya.deskPrice)
      setHomePrice(wilaya.homePrice)
    }
  }, [openDialog, wilaya])

  const handleSubmit = async () => {
    console.log('Submitting:', { deskPrice, homePrice })
    try {
      if (deskPrice === wilaya.deskPrice && homePrice === wilaya.homePrice) {
        setOpenDialog(false)
        return
      }
      const response = await axios.put(
        `http://localhost:3000/wilayas/${wilaya._id}`,
        {
          deskPrice,
          homePrice,
        }
      )
      console.log('Update successful:', response.data)
      updateWilaya(response.data)
      setOpenDialog(false)
      // Optionally, handle any post-update logic here, such as redirecting or displaying a success message
    } catch (error) {
      console.error('Failed to update wilaya:', error)
      // Optionally, handle errors, such as displaying error messages to the user
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={(event) => event.stopPropagation()}>
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Shipping cost for " {wilaya.name} "</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='deskPrice' className='text-right'>
              Desk Price
            </Label>
            <Input
              id='deskPrice'
              value={deskPrice}
              onChange={(event) => setDeskPrice(Number(event.target.value))}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='homePrice' className='text-right'>
              Home Price
            </Label>
            <Input
              id='deskPrice'
              value={homePrice}
              onChange={(event) => setHomePrice(Number(event.target.value))}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
