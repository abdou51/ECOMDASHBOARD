import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  username: z.string().min(1, { message: 'Please enter your username' }),
  password: z.string().min(1, {
    message: 'Please enter your password',
  }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate() // Get the navigate function
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setErrorMessage('')
      setIsLoading(true)
      const response = await axios.post(
        'http://localhost:3000/users/login',
        data
      )
      if (response.status === 200) {
        console.log(response.data)
        localStorage.setItem('jwt', response.data.token)
        setIsLoading(false)
        navigate('/')
      } else {
        console.log(response.data)
        setErrorMessage(response.data.message)
        setIsLoading(false)
      }
      console.log(data)
    } catch (err) {
      console.log(err)
      setErrorMessage(
        err.response?.data?.message || 'Network error or server not responding'
      )
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading} disabled={isLoading}>
              Login
            </Button>
            <span className='text-center font-bold text-red-500'>
              {errorMessage}
            </span>
          </div>
        </form>
      </Form>
    </div>
  )
}
