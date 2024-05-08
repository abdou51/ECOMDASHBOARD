import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@/components/custom/button'
import { useToast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Switch } from '@/components/ui/switch'
import { Category } from '../data/schema'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
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

import { productSchema } from '../data/schema'
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  updateProduct: (updatedCategory: TData) => void
  deleteProduct: (deletedCategory: TData) => void
  categories: Category[]
}

export function DataTableRowActions<TData>({
  row,
  updateProduct,
  deleteProduct,
  categories,
}: DataTableRowActionsProps<TData>) {
  // Toast Hook :
  const { toast } = useToast()

  // Product State
  const product = productSchema.parse(row.original)
  const [openColorDialog, setOpenColorDialog] = useState(false)
  const [openColorDetailsDialog, setOpenColorDetailsDialog] = useState(null)
  const [openCombox, setOpenCombobox] = useState(false)

  // data api state

  // add product state
  const [selectedAddCategory, setSelectedAddCategory] = useState(
    product.category
  )
  const [selectedAddFrName, setSelectedAddFrName] = useState(product.frName)
  const [selectedAddEngName, setSelectedAddEngName] = useState(product.engName)
  const [selectedAddArName, setSelectedAddArName] = useState(product.arName)
  const [selectedAddPrice, setSelectedAddPrice] = useState(product.price)
  const [selectedAddFrDescription, setSelectedAddFrDescription] = useState(
    product.frDescription
  )
  const [selectedAddEnDescription, setSelectedAddEnDescription] = useState(
    product.engDescription
  )
  const [selectedAddArDescription, setSelectedAddArDescription] = useState(
    product.arDescription
  )
  const [selectedAddSingleColor, setSelectedAddSingleColor] = useState('')
  const [selectedAddColors, setSelectedAddColors] = useState(product.colors)

  // Edit and Delete Dialogs States
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(false)
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
  const handleFileUpload = (event, colorHex) => {
    const files = Array.from(event.target.files)

    // Update the color's images with the selected files directly in the state
    setSelectedAddColors((prevColors) =>
      prevColors.map((color) =>
        color.hex === colorHex
          ? {
              ...color,
              images: {
                ...color.images,
                urls: files, // Store file objects for later processing
              },
            }
          : color
      )
    )
    console.log(selectedAddColors)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // Initialize an array for promises
      const imageUploadPromises = []
      const updatedColors = []

      // Iterate through each color and handle uploads
      for (const color of selectedAddColors) {
        // Check if there are any new files to upload
        if (color.images && color.images.urls && color.images.urls.length > 0) {
          const formData = new FormData()

          // Append only new files that have not been uploaded yet
          for (const file of color.images.urls) {
            if (file instanceof File) {
              formData.append('images', file)
            }
          }

          // Proceed with uploading only if there are new files in the form data
          if (formData.has('images')) {
            imageUploadPromises.push(
              axios.post('http://localhost:3000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
            )
          } else {
            // No new files added, retain the original images reference
            updatedColors.push({
              ...color,
              images: color.images,
            })
          }
        } else {
          // If images haven't changed, retain the original images reference
          updatedColors.push({
            ...color,
            images: color.images,
          })
        }
      }

      // Execute all image upload promises
      const imageResponses = await Promise.all(imageUploadPromises)

      // Combine newly uploaded images with unchanged colors
      let index = 0
      imageResponses.forEach((res) => {
        // Find the corresponding color and update its images
        updatedColors.push({
          ...selectedAddColors[index],
          images: res.data._id,
        })
        index++
      })

      // Create the product data to be submitted
      const productData = {
        frName: selectedAddFrName,
        engName: selectedAddEngName,
        arName: selectedAddArName,
        price: selectedAddPrice,
        frDescription: selectedAddFrDescription,
        engDescription: selectedAddEnDescription,
        arDescription: selectedAddArDescription,
        category: selectedAddCategory._id,
        colors: updatedColors,
      }

      // Send an API request to update the product
      const response = await axios.put(
        `http://localhost:3000/products/${product._id}`,
        productData
      )

      // Update the product in the parent component
      updateProduct(response.data)

      // Close the dialog and reset the loading state
      setIsLoading(false)
      setOpenEditDialog(false)

      // Optionally, show a success toast
      toast({
        title: 'Product updated successfully!',
        description: `Product ${response.data.engName} has been updated.`,
      })
    } catch (error) {
      console.error('Error updating product:', error)
      setIsLoading(false)

      // Optionally, show an error toast
      toast({
        title: 'Error updating product',
        description: 'There was a problem updating the product.',
        variant: 'destructive',
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
        <DialogContent className='sm:max-h[1200px] sm:max-w-[900px]'>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='arabicDescription'>Colors</Label>
              <div className='col-span-3 flex items-center justify-between'>
                <div className='flex gap-6 '>
                  {selectedAddColors?.map((colorItem) => (
                    <Dialog
                      open={openColorDetailsDialog === colorItem.hex} // Dialog opens based on this condition
                      onOpenChange={() =>
                        setOpenColorDetailsDialog(
                          openColorDetailsDialog === colorItem.hex
                            ? null
                            : colorItem.hex
                        )
                      } // Toggle open/close based on current state
                      key={colorItem.hex}
                    >
                      <DialogTrigger>
                        <div
                          style={{
                            width: '25px',
                            height: '25px',
                            backgroundColor: colorItem.hex,
                            borderRadius: '50%',
                            outline: '2px solid ',
                          }}
                          title={colorItem.hex}
                        ></div>
                      </DialogTrigger>
                      <DialogContent className='sm:max-h[600px] sm:max-w-[600px]'>
                        <DialogHeader>
                          <DialogTitle>Color Details</DialogTitle>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                          <div className='grid grid-cols-5 items-center gap-4'>
                            <Label htmlFor='color'>Chosen Color</Label>
                            <div
                              className='col-span-3'
                              style={{
                                width: '25px',
                                height: '25px',
                                backgroundColor: colorItem.hex,
                                borderRadius: '50%',
                                outline: '2px solid ',
                              }}
                              title={colorItem.hex}
                            ></div>
                            <Button
                              onClick={() => {
                                setSelectedAddColors(
                                  selectedAddColors.filter(
                                    (color) => color.hex !== colorItem.hex
                                  )
                                )
                              }}
                            >
                              Delete
                            </Button>
                            <Label htmlFor='images'>Images</Label>
                            <div className='h-16 w-16 rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md'>
                              <label
                                htmlFor='upload'
                                className='flex cursor-pointer flex-col items-center gap-2'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-8 w-8 fill-white stroke-indigo-500'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                  />
                                </svg>
                              </label>

                              <input
                                id='upload'
                                type='file'
                                multiple
                                className='hidden'
                                accept='image/png, image/jpeg'
                                onChange={(event) =>
                                  handleFileUpload(event, colorItem.hex)
                                }
                              />
                            </div>
                            <div className='col-span-3 flex  gap-2'>
                              {colorItem?.images?.urls?.length || 0} images
                              Selected
                            </div>
                          </div>
                        </div>

                        <hr />
                        <DialogHeader>
                          <div className='flex items-center justify-between'>
                            <DialogTitle>Size Details</DialogTitle>
                            <Button
                              onClick={() => {
                                // Mapping through existing colors to find the one with the matching hex value
                                const updatedColors = selectedAddColors.map(
                                  (color) => {
                                    if (color.hex === colorItem.hex) {
                                      // Found the color, now add a new size to its sizes array
                                      return {
                                        ...color,
                                        sizes: [
                                          ...color.sizes,
                                          {
                                            size: 0,
                                            inStock: false,
                                          },
                                        ],
                                      }
                                    }
                                    return color // Return unmodified color if not the one we're looking for
                                  }
                                )

                                // Update the state with the new colors array
                                setSelectedAddColors(updatedColors)
                                setOpenColorDialog(false)
                              }}
                            >
                              Add New Size
                            </Button>
                          </div>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                          {colorItem.sizes?.map((size, index) => (
                            <>
                              <div className='grid grid-cols-5 items-center gap-4'>
                                <Label htmlFor={`size-${index}`}>
                                  Size {index + 1}
                                </Label>
                                <Input
                                  id={`size-${index}`}
                                  type='number'
                                  className='col-span-1 dark:file:text-foreground'
                                  value={size.size || ''} // Handle undefined or null size values gracefully
                                  onChange={(e) => {
                                    const newSizeValue = e.target.value
                                      ? parseInt(e.target.value, 10)
                                      : null
                                    const updatedColors = selectedAddColors.map(
                                      (color) => {
                                        if (color.hex === colorItem.hex) {
                                          // Clone the sizes and update the specific size
                                          const updatedSizes = color.sizes.map(
                                            (s, sIndex) => {
                                              if (sIndex === index) {
                                                return {
                                                  ...s,
                                                  size: newSizeValue,
                                                }
                                              }
                                              return s
                                            }
                                          )
                                          return {
                                            ...color,
                                            sizes: updatedSizes,
                                          }
                                        }
                                        return color
                                      }
                                    )
                                    setSelectedAddColors(updatedColors)
                                    console.log(updatedColors)
                                  }}
                                />
                                <div className='col-span-2 flex items-center space-x-2'>
                                  <Switch
                                    checked={size.inStock}
                                    id={`inStock-${index}`}
                                    onCheckedChange={(e) => {
                                      const newInStockValue = e

                                      const updatedColors =
                                        selectedAddColors.map((color) => {
                                          if (color.hex === colorItem.hex) {
                                            const updatedSizes =
                                              color.sizes.map((s, sIndex) => {
                                                if (sIndex === index) {
                                                  return {
                                                    ...s,
                                                    inStock: newInStockValue,
                                                  }
                                                }
                                                return s
                                              })
                                            return {
                                              ...color,
                                              sizes: updatedSizes,
                                            }
                                          }
                                          return color
                                        })

                                      setSelectedAddColors(updatedColors)
                                    }}
                                  />

                                  <label
                                    htmlFor={`inStock-${index}`}
                                    className='text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                  >
                                    In Stock
                                  </label>
                                </div>

                                <Button
                                  className='h-8 w-8 rounded-sm border-2 border-solid border-red-500 bg-transparent text-red-500 hover:bg-transparent'
                                  onClick={() => {
                                    // Create a new array by mapping over the selectedAddColors
                                    const updatedColors = selectedAddColors.map(
                                      (color) => {
                                        if (color.hex === colorItem.hex) {
                                          // Filter out the size at the specific index
                                          const filteredSizes =
                                            color.sizes.filter(
                                              (_, sIndex) => sIndex !== index
                                            )
                                          // Return the color with the updated sizes array
                                          return {
                                            ...color,
                                            sizes: filteredSizes,
                                          }
                                        }
                                        return color
                                      }
                                    )

                                    // Update the state with the new colors array
                                    setSelectedAddColors(updatedColors)
                                  }}
                                >
                                  X
                                </Button>
                              </div>

                              <Separator></Separator>
                            </>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
                <Dialog
                  open={openColorDialog}
                  onOpenChange={setOpenColorDialog}
                >
                  <DialogTrigger>
                    <Button>Add New Color</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className='grid gap-4 py-4'>
                      <Label htmlFor='color'>Color</Label>
                      <Input
                        id='color'
                        type='color'
                        className='col-span-3'
                        value={selectedAddSingleColor}
                        onChange={(e) =>
                          setSelectedAddSingleColor(e.target.value)
                        }
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setSelectedAddColors([
                            ...selectedAddColors,
                            {
                              hex: selectedAddSingleColor,
                              sizes: [],
                              images: [],
                            },
                          ])
                          setOpenColorDialog(false)
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Label htmlFor='englishName'>English Name</Label>
              <Input
                id='englishName'
                value={selectedAddEngName}
                onChange={(event) => setSelectedAddEngName(event.target.value)}
                className='col-span-3'
              />
              <Label htmlFor='frenchName'>French Name</Label>
              <Input
                id='frenchName'
                value={selectedAddFrName}
                onChange={(event) => setSelectedAddFrName(event.target.value)}
                className='col-span-3'
              />
              <Label htmlFor='arabicName'>Arabic Name</Label>
              <Input
                id='arabicName'
                value={selectedAddArName}
                onChange={(event) => setSelectedAddArName(event.target.value)}
                className='col-span-3'
              />
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                value={selectedAddPrice}
                onChange={(event) =>
                  setSelectedAddPrice(Number(event.target.value))
                }
                className='col-span-3'
              />
              <Label htmlFor='englishDescription'>English Description</Label>
              <Textarea
                id='englishDescription'
                value={selectedAddEnDescription}
                onChange={(event) =>
                  setSelectedAddEnDescription(event.target.value)
                }
                className='col-span-3'
              />
              <Label htmlFor='frenchDescription'>French Description</Label>
              <Textarea
                id='frenchDescription'
                value={selectedAddFrDescription}
                onChange={(event) =>
                  setSelectedAddFrDescription(event.target.value)
                }
                className='col-span-3'
              />
              <Label htmlFor='arabicDescription'>Arabic Description</Label>
              <Textarea
                id='arabicDescription'
                value={selectedAddArDescription}
                onChange={(event) =>
                  setSelectedAddArDescription(event.target.value)
                }
                className='col-span-3'
              />
              <Label htmlFor='category'>Category</Label>
              <Popover open={openCombox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={openCombox}
                    className='w-[200px] justify-between'
                  >
                    {selectedAddCategory?.engName}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category._id}
                          onSelect={() => {
                            setSelectedAddCategory(category)
                            setOpenCombobox(false)
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
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Update The product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
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
