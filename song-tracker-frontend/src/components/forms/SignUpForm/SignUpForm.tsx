import {zodResolver} from '@hookform/resolvers/zod'
import {useMutation} from '@tanstack/react-query'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router'
import {toast} from 'react-toastify'
import {createUser} from '@/api/authentication'
import {FormItem} from '@/components/forms/shared/FormItem'
import {useAuth} from '@/context/AuthContext'
import type {LoginSignUpProps} from '../../types'
import {type SignUpFormData, signUpSchema} from './SignUpSchema'

export function SignUpForm({setIsSignUp}: LoginSignUpProps) {
  const {
    setError,
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  })

  const {login} = useAuth()
  const navigate = useNavigate()

  const createUserMutation = useMutation({
    mutationFn: createUser,
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
    },
    onError: ({message}) => {
      setError('username', {
        type: 'server',
        message
      })
    }
  })

  function onSubmit({username, password}: SignUpFormData) {
    createUserMutation.mutate({username, password})
  }

  return (
    <form
      className='flex w-full flex-col justify-center px-10 sm:px-40 md:px-20'
      id='sign-up-form'
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <FormItem
        error={errors.confirmPassword}
        id='confirmPassword'
        placeholder='Confirm password'
        register={register}
        title='Confirm Password'
        type='password'
      />
      <button
        className='my-2 w-fit cursor-pointer self-end rounded-sm bg-blue-500 p-2 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
        disabled={!isValid}
        type='submit'
      >
        Sign Up
      </button>
      <div className='text-center'>
        <button
          className='cursor-pointer underline hover:text-blue-500'
          onClick={() => setIsSignUp(false)}
          type='button'
        >
          Log in with existing account
        </button>
      </div>
    </form>
  )
}