import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router'
import {toast} from 'react-toastify'
import {loginRequest} from '@/api/authentication'
import {FormItem} from '@/components/forms/shared/FormItem'
import {useAuth} from '@/context/AuthContext'
import type {LoginSignUpProps} from '../../types'
import {type LoginFormData, loginSchema} from './LoginSchema'
import {valibotResolver} from "@hookform/resolvers/valibot";

export function LoginForm({setIsSignUp}: LoginSignUpProps) {
  const {
    setError,
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<LoginFormData>({
    resolver: valibotResolver(loginSchema),
    mode: 'onTouched',
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
      toast(`Successfully logged in as ${username}`)
    },
    onError: ({message}) => {
      setError(
        'password', {
          type: "server",
          message
        }
      )
    }
  })

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data)
  }

  return (
    <form
      className='flex w-full flex-col justify-center px-10 sm:px-40 md:px-20'
      id='login-form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-6">
        <h2 className="font-bold text-2xl">Log in</h2>
        <p className="mt-1 text-slate-400 text-sm">
          Pick up where you left off with the songs you're learning.
        </p>
      </div>
      <FormItem
        error={errors.username}
        id='username'
        placeholder='Enter username'
        register={register}
        title='Username'
      />
      <FormItem
        error={errors.password}
        id='password'
        placeholder='Enter password'
        register={register}
        title='Password'
        type='password'
      />
      <button
        className='my-2 w-fit cursor-pointer self-end rounded-sm bg-amber-600 hover:bg-amber-500 p-2 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
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