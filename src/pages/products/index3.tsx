import { Layout, LayoutBody } from '@/components/custom/layout'
import { useState, useEffect } from 'react'
import { Category, Color } from './data/schema'
import { Button } from '@/components/custom/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { fetchCategories } from '../categories/data/api'

export default function DeliveryPricing() {
  // UI logic state
  const [openDialog, setOpenDialog] = useState(false)
  const [openColorDialog, setOpenColorDialog] = useState(false)
  const [openColorDetailsDialog, setOpenColorDetailsDialog] = useState(null)
  const [openCombobox, setOpenCombobox] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])

  // Add product state
  const [selectedAddCategory, setSelectedAddCategory] = useState<Category>()
  const [selectedAddFrName, setSelectedAddFrName] = useState('')
  const [selectedAddEngName, setSelectedAddEngName] = useState('')
  const [selectedAddArName, setSelectedAddArName] = useState('')
  const [selectedAddPrice, setSelectedAddPrice] = useState(0)
  const [selectedAddFrDescription, setSelectedAddFrDescription] = useState('')
  const [selectedAddEnDescription, setSelectedAddEnDescription] = useState('')
  const [selectedAddArDescription, setSelectedAddArDescription] = useState('')
  const [selectedAddColors, setSelectedAddColors] = useState<Color[]>([])

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <>
      <Layout>
        <LayoutBody className='flex flex-col' fixedHeight>
          <div className='mb-2 flex items-center justify-between space-y-2'>
            <div className='flex items-center space-x-2'>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger>
                  <Button>ADD NEW PRODUCT</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-h[1200px] sm:max-w-[900px]'>
                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='arabicDescription'>Colors</Label>
                      <div className='col-span-3 flex items-center justify-between'>
                        <div className='flex gap-6 '>
                          {selectedAddColors.map((colorItem, colorIndex) => (
                            <Dialog
                              key={colorItem.hex}
                              open={openColorDetailsDialog === colorItem.hex}
                              onOpenChange={() =>
                                setOpenColorDetailsDialog(
                                  openColorDetailsDialog === colorItem.hex
                                    ? null
                                    : colorItem.hex
                                )
                              }
                            >
                              <DialogTrigger>
                                <div
                                  style={{
                                    width: '25px',
                                    height: '25px',
                                    backgroundColor: colorItem.hex,
                                    borderRadius: '50%',
                                    outline: '2px solid',
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
                                            (_, idx) => idx !== colorIndex
                                          )
                                        )
                                      }}
                                    >
                                      Delete
                                    </Button>
                                    {colorItem.sizes.map((size, sizeIndex) => (
                                      <div
                                        key={sizeIndex}
                                        className='grid grid-cols-5 items-center gap-4'
                                      >
                                        <Label
                                          htmlFor={`size-${colorIndex}-${sizeIndex}`}
                                        >
                                          Size {size.size}
                                        </Label>
                                        <Input
                                          id={`size-${colorIndex}-${sizeIndex}`}
                                          type='number'
                                          className='col-span-1'
                                          value={size.size}
                                          onChange={(e) => {
                                            const newSize = parseInt(
                                              e.target.value
                                            )
                                            const updatedColors = [
                                              ...selectedAddColors,
                                            ]
                                            updatedColors[colorIndex].sizes[
                                              sizeIndex
                                            ].size = newSize
                                            setSelectedAddColors(updatedColors)
                                          }}
                                        />
                                        <Switch
                                          checked={size.inStock}
                                          onChange={(e) => {
                                            const updatedColors = [
                                              ...selectedAddColors,
                                            ]
                                            updatedColors[colorIndex].sizes[
                                              sizeIndex
                                            ].inStock = e.target.checked
                                            setSelectedAddColors(updatedColors)
                                          }}
                                        />
                                        <Button
                                          onClick={() => {
                                            const updatedColors = [
                                              ...selectedAddColors,
                                            ]
                                            updatedColors[
                                              colorIndex
                                            ].sizes.splice(sizeIndex, 1)
                                            setSelectedAddColors(updatedColors)
                                          }}
                                        >
                                          Remove Size
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      onClick={() => {
                                        const newSize = {
                                          size: 36,
                                          inStock: true,
                                        } // Default new size
                                        const updatedColors = [
                                          ...selectedAddColors,
                                        ]
                                        updatedColors[colorIndex].sizes.push(
                                          newSize
                                        )
                                        setSelectedAddColors(updatedColors)
                                      }}
                                    >
                                      Add Size
                                    </Button>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button>Save changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                        <Button
                          onClick={() => {
                            const newColor = {
                              hex: '#000000',
                              sizes: [],
                              images: [],
                            } // Default new color
                            setSelectedAddColors([
                              ...selectedAddColors,
                              newColor,
                            ])
                          }}
                        >
                          Add New Color
                        </Button>
                      </div>
                      <Label htmlFor='englishName'>English Name</Label>
                      <Input
                        id='englishName'
                        value={selectedAddEngName}
                        onChange={(event) =>
                          setSelectedAddEngName(event.target.value)
                        }
                        className='col-span-3'
                      />
                      <Label htmlFor='frenchName'>French Name</Label>
                      <Input
                        id='frenchName'
                        value={selectedAddFrName}
                        onChange={(event) =>
                          setSelectedAddFrName(event.target.value)
                        }
                        className='col-span-3'
                      />
                      <Label htmlFor='arabicName'>Arabic Name</Label>
                      <Input
                        id='arabicName'
                        value={selectedAddArName}
                        onChange={(event) =>
                          setSelectedAddArName(event.target.value)
                        }
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
                      <Label htmlFor='englishDescription'>
                        English Description
                      </Label>
                      <Textarea
                        id='englishDescription'
                        value={selectedAddEnDescription}
                        onChange={(event) =>
                          setSelectedAddEnDescription(event.target.value)
                        }
                        className='col-span-3'
                      />
                      <Label htmlFor='frenchDescription'>
                        French Description
                      </Label>
                      <Textarea
                        id='frenchDescription'
                        value={selectedAddFrDescription}
                        onChange={(event) =>
                          setSelectedAddFrDescription(event.target.value)
                        }
                        className='col-span-3'
                      />
                      <Label htmlFor='arabicDescription'>
                        Arabic Description
                      </Label>
                      <Textarea
                        id='arabicDescription'
                        value={selectedAddArDescription}
                        onChange={(event) =>
                          setSelectedAddArDescription(event.target.value)
                        }
                        className='col-span-3'
                      />
                      <Label htmlFor='category'>Category</Label>
                      <Popover
                        open={openCombobox}
                        onOpenChange={setOpenCombobox}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openCombobox}
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
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </LayoutBody>
      </Layout>
    </>
  )
}
