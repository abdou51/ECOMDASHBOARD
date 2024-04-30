import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/custom/button'
import { useToast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { orderSchema } from '../data/schema'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  updateOrder: (updatedOrder: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  updateOrder,
}: DataTableRowActionsProps<TData>) {
  // dropdown update choises
  const statuses = [
    'pending',
    'confirmed',
    'cancelled',
    'shipped',
    'delivered',
    'returned',
  ]

  // Toast Hook :
  const { toast } = useToast()

  // Product State
  const order = orderSchema.parse(row.original)
  const [orderStatus, setOrderStatus] = useState(order.status)

  // Edit and Delete Dialogs States
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [open, setOpen] = useState(false)

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!openEditDialog) {
      setOrderStatus(order.status)
    }
  }, [openEditDialog, order])
  const handleEditCategory = async () => {
    try {
      setIsLoading(true)
      if (orderStatus === order.status) {
        setOpenEditDialog(false)
        setIsLoading(false)
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'Product Updated Successfully',
        })
        return
      }
      const response = await axios.put(
        `http://localhost:3000/orders/${order._id}`,
        {
          status: orderStatus,
        }
      )
      if (response.status !== 200) {
        setIsLoading(false)
        setOpenEditDialog(false)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error updating order. Please try again.',
        })
      } else {
        updateOrder(response.data)
        setIsLoading(false)
        setOpenEditDialog(false)
        toast({
          variant: 'default',
          className: 'bg-green-500',
          title: 'Success',
          description: 'Order Updated Successfully',
        })
      }
    } catch (error) {
      console.error('Failed to update order', error)
      setIsLoading(false)
      setOpenEditDialog(false)
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
          <DropdownMenuItem onClick={() => setOpenViewDialog(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className='sm:max-w-[850px]'>
          <DialogHeader>
            <DialogTitle>
              Order {order.reference} ( {order.status} )
            </DialogTitle>
          </DialogHeader>
          <Separator orientation='vertical' />
          <DialogHeader>
            <DialogTitle>Client Details :</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Full Name</Label>
              <Separator orientation='vertical' className='' />
              <span className='col-span-2'>{order.fullName}</span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Shipping Type</Label>
              <Separator orientation='vertical' className='' />
              <span
                className={`col-span-2 font-bold ${order.shippingType === 'home' ? 'text-blue-500' : 'text-green-500'}`}
              >
                {order.shippingType}
              </span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Address</Label>
              <Separator orientation='vertical' />
              <span className='col-span-2'>{order.address}</span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Wilaya</Label>
              <Separator orientation='vertical' />
              <span className='col-span-2'>{order.wilaya}</span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Commune</Label>
              <Separator orientation='vertical' />
              <span className='col-span-2'>{order.commune}</span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Phone Numbers</Label>
              <Separator orientation='vertical' />
              <span className='col-span-2'>
                {order.phoneNumber1} / {order.phoneNumber2}
              </span>
            </div>
            <Separator />
            <div className='grid grid-cols-5 items-center gap-4'>
              <Label className='col-span-2'>Note</Label>
              <Separator orientation='vertical' />
              <p className='col-span-2 text-sm'>{order.note}</p>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle>Product Details :</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems?.map((orderItem) => (
                <TableRow key={orderItem.product?._id}>
                  <TableCell className='font-medium'>
                    {orderItem.product?.engName}
                  </TableCell>
                  <TableCell>
                    <div
                      key={orderItem.hex}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: orderItem.hex,
                        borderRadius: '50%',
                      }}
                      title={orderItem.hex}
                    ></div>
                  </TableCell>
                  <TableCell>{orderItem.size}</TableCell>
                  <TableCell>{orderItem.quantity}</TableCell>
                  <TableCell>{orderItem.price} Dzd</TableCell>
                  <TableCell className='text-right'>
                    {orderItem.price * orderItem.quantity} Dzd
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Shipping Fees</TableCell>
                <TableCell className='text-right'>
                  {order.shippingPrice} Dzd
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className='text-right'>{order.total} Dzd</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      </Dialog>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className='sm:max-w-[450px]'>
          <DialogHeader>
            <DialogTitle>
              Edit Order Status For order "{order.reference}"
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Status
              </Label>
              <div className='flex w-[465px] flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='w-[200px] justify-between'
                    >
                      {orderStatus.charAt(0).toUpperCase() +
                        orderStatus.slice(1)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status}
                            onSelect={() => {
                              setOrderStatus(status)
                              setOpen(false)
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
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              {isLoading ? (
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
