import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { fetchProducts } from './data/api'
import { useState, useEffect } from 'react'
import { Category, Product, ProductMetadata, Color, Size } from './data/schema'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableRowActions } from './components/data-table-row-actions'
import { Button } from '@/components/custom/button'
import { Separator } from '@/components/ui/separator'
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

interface FetchProductsParams {
  page?: number
  limit?: number
  category?: string
}

export default function DeliveryPricing() {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'frName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='French Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('frName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'arName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Arabic Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('arName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'engName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='English Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('engName')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Price' />
      ),
      cell: ({ row }) => <div>{row.getValue('price')} Dzd</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'colors',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Colors' />
      ),
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {row.original.colors.map((color) => (
            <div
              key={color.hex}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color.hex,
                borderRadius: '50%',
              }}
              title={color.hex}
            ></div>
          ))}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Category' />
      ),
      cell: ({ row }) => <div>{row.original.category.engName}</div>,
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
          deleteProduct={deleteProduct}
          updateProduct={updateProduct}
        />
      ),
    },
  ]
  const updateProduct = (updatedProduct: Product) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    )
  }
  const deleteProduct = (deletedProduct: Product) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== deletedProduct._id)
    )
  }
  const addProduct = (addedProduct: Product) => {
    setProducts((currentProducts) => [addedProduct, ...currentProducts])
  }
  // api functionnality state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ui logic state
  const [openDialog, setOpenDialog] = useState(false)
  const [openColorDialog, setOpenColorDialog] = useState(false)
  const [openColorDetailsDialog, setOpenColorDetailsDialog] = useState(null)
  const [openCombox, setOpenCombobox] = useState(false)

  // data api state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [metadata, setMetadata] = useState<ProductMetadata | null>(null)

  // add product state
  const [selectedAddCategory, setSelectedAddCategory] = useState<Category>()
  const [selectedAddFrName, setSelectedAddFrName] = useState('')
  const [selectedAddEngName, setSelectedAddEngName] = useState('')
  const [selectedAddArName, setSelectedAddArName] = useState('')
  const [selectedAddPrice, setSelectedAddPrice] = useState(0)
  const [selectedAddFrDescription, setSelectedAddFrDescription] = useState('')
  const [selectedAddEnDescription, setSelectedAddEnDescription] = useState('')
  const [selectedAddArDescription, setSelectedAddArDescription] = useState('')
  const [selectedAddSingleColor, setSelectedAddSingleColor] = useState('')
  const [selectedAddColors, setSelectedAddColors] = useState<Color[]>([])
  const [images, setImages] = useState([])
  //test
  const [selectedAddSizes, setSelectedAddSizes] = useState<Size[]>([])

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

  // useEffect(() => {
  //   if (!openDialog) {
  //     setCategoryName('')
  //   }
  // }, [openDialog, categoryName])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch products and extract products and metadata from the response
      const { products: fetchedProducts, metadata: fetchedMetadata } =
        await fetchProducts()
      setProducts(fetchedProducts) // Update the products state
      setMetadata(fetchedMetadata)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])
  const handleFetchProducts = async (params: FetchProductsParams) => {
    setLoading(true)
    try {
      const { products, metadata } = await fetchProducts(params)
      setProducts(products)
      setMetadata(metadata)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }
  return (
    <>
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
              <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
              <p className='text-muted-foreground'>
                {metadata?.totalDocs} Product(s) Found !
              </p>
            </div>
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
                                            (color) =>
                                              color.hex !== colorItem.hex
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
                                        onChange={(event) => {
                                          const files = Array.from(
                                            event.target.files
                                          )
                                          const newImages = []
                                          files.forEach((file) => {
                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                              newImages.push(reader.result)
                                              if (
                                                newImages.length ===
                                                files.length
                                              ) {
                                                setImages(newImages)
                                              }
                                            }
                                            reader.readAsDataURL(file)
                                          })
                                        }}
                                      />
                                    </div>
                                    <div className='col-span-3 flex h-16 w-16 gap-2'>
                                      {images.map((image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`Uploaded ${index + 1}`}
                                          className='h-auto w-auto max-w-full'
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <hr />
                                <DialogHeader>
                                  <div className='flex items-center justify-between'>
                                    <DialogTitle>Size Details</DialogTitle>
                                    <Button
                                      onClick={() => {
                                        setSelectedAddSizes([
                                          ...selectedAddSizes,
                                          { size: null, inStock: false },
                                        ])
                                        setOpenColorDialog(false)
                                      }}
                                    >
                                      Add New Size
                                    </Button>
                                  </div>
                                </DialogHeader>
                                <div className='grid gap-4 py-4'>
                                  {selectedAddSizes.map((size, index) => (
                                    <>
                                      <div className='grid grid-cols-5 items-center gap-4'>
                                        <Label htmlFor={`size-${index}`}>
                                          Size {index + 1}
                                        </Label>
                                        <Input
                                          id={`size-${index}`}
                                          type='text'
                                          className='col-span-1 dark:file:text-foreground'
                                          value={Number(size.size)}
                                          onChange={(e) => {
                                            const updatedSizes = [
                                              ...selectedAddSizes,
                                            ]
                                            updatedSizes[index].size = Number(
                                              e.target.value
                                            )
                                            setSelectedAddSizes(updatedSizes)
                                            if (e.target.value === '') {
                                              updatedSizes[index].size = null
                                              setSelectedAddSizes(updatedSizes)
                                            }
                                          }}
                                        />
                                        <div className='col-span-2 flex items-center space-x-2'>
                                          <Switch
                                            checked={size.inStock}
                                            id={`inStock-${index}`}
                                            onCheckedChange={(e) => {
                                              const updatedSizes = [
                                                ...selectedAddSizes,
                                              ]
                                              updatedSizes[index].inStock = e
                                              setSelectedAddSizes(updatedSizes)
                                              console.log(updatedSizes)
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
                                            setSelectedAddSizes(
                                              selectedAddSizes.filter(
                                                (_, i) => i !== index
                                              )
                                            )
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
                                    { hex: selectedAddSingleColor },
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
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <DataTable
              data={products}
              metadata={metadata}
              columns={columns}
              loading={loading}
              error={error}
              fetchProducts={handleFetchProducts}
            />
          </div>
        </LayoutBody>
      </Layout>
    </>
  )
}
