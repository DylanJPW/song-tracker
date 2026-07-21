import type {FieldError, FieldValues, Path, UseFormRegister} from "react-hook-form";
import type {HTMLInputTypeAttribute} from "react";

interface FormItemProps<T extends FieldValues> {
  id: Path<T>;
  title: string;
  register: UseFormRegister<T>
  placeholder?: string;
  error?: FieldError | undefined;
  type?: HTMLInputTypeAttribute;
}

export function FormItem<T extends FieldValues>({
                                                  id,
                                                  title,
                                                  register,
                                                  placeholder,
                                                  error,
                                                  type = "text"
                                                }: FormItemProps<T>) {
  return (
    <div className='my-2 flex flex-col'>
      <label className='pl-2' htmlFor={id}>
        {title}
      </label>
      <input
        {...register(id)}
        className={`rounded-2xl border-2 ${error ? "border-red-800" : "border-white"} p-2`}
        id={id}
        placeholder={placeholder}
        type={type}
      />
      {error && (
        <p className='text-red-500 pl-2'>{error.message}</p>
      )}
    </div>
  )
}