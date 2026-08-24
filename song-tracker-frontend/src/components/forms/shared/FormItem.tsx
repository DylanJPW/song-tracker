import type {HTMLInputTypeAttribute} from 'react'
import type {FieldError, FieldValues, Path, UseFormRegister} from 'react-hook-form'

export interface FormItemProps<T extends FieldValues> {
  id: Path<T>
  title: string
  register: UseFormRegister<T>
  placeholder?: string
  error?: FieldError | undefined
  type?: HTMLInputTypeAttribute
}

export function FormItem<T extends FieldValues>({
                                                  id,
                                                  title,
                                                  register,
                                                  placeholder,
                                                  error,
                                                  type = 'text'
                                                }: FormItemProps<T>) {
  return (
    <div className='my-2 flex flex-col'>
      <label className='pl-2' htmlFor={id}>
        {title}
      </label>
      <input
        {...register(id)}
        className={`rounded-2xl border-2 bg-slate-800 p-2 text-white placeholder:text-slate-500 transition-colors focus:outline-none ${
          error ? 'border-red-800' : 'border-slate-600 focus:border-amber-500'
        }`}
        id={id}
        placeholder={placeholder}
        type={type}
      />
      {error && <p className='pl-2 text-red-500'>{error.message}</p>}
    </div>
  )
}