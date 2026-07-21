import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router'
import {toast} from 'react-toastify'
import {loginRequest} from '@/api/authentication'
import {useAuth} from '@/context/AuthContext'
import {type LoginFormData, loginSchema} from './LoginSchema'
import type {LoginSignUpProps} from '../types'
import {FormItem} from "@/components/forms/shared/FormItem";

export function LoginForm({setIsSignUp}: LoginSignUpProps) {
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const {login} = useAuth()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, {username}) => {
      login(data.token)
      navigate('/')
      toast(`Successfully logged in as ${username}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }
  })

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data)
  }

  return (
    <form
      className='flex flex-col justify-center w-full px-10 sm:px-40 md:px-20'
      id="login-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormItem
        id="username"
        title="Username"
        register={register}
        error={errors.username}
        placeholder="Enter username"
      />
      <FormItem
        id="password"
        title="Password"
        register={register}
        error={errors.password}
        placeholder="Enter password"
        type="password"
      />
      <button
        className='my-2 w-fit cursor-pointer self-end rounded-sm bg-blue-500 p-2 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        disabled={!isValid}
        type='submit'
      >
        Log In
      </button>
      <div className='text-center'>
        <button
          className='cursor-pointer underline hover:text-blue-500'
          onClick={() => setIsSignUp(true)}
          type='button'
        >
          Create new account
        </button>
      </div>
    </form>
  )
}