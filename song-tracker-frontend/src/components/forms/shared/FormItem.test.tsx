import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {FormItem, type FormItemProps} from './FormItem'
import type {User} from "@/api/authentication";

const registerMock = vi.fn();

const defaultProps: FormItemProps<User> = {
  error: undefined,
  id: 'username',
  placeholder: 'Enter username',
  register: registerMock,
  title: 'Username',
  type: 'text'
}

describe('FormItem', () => {
  const renderFormItem = ({
                            error, id, placeholder = 'Enter username', register, title, type = 'text'
                          }: FormItemProps<User>) => {


    render(
      <FormItem
        error={error}
        id={id}
        placeholder={placeholder}
        register={register}
        title={title}
        type={type}
      />
    )
  }

  it('renders the label and input', () => {
    renderFormItem(defaultProps)

    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
  })

  it('allows the user to type', async () => {
    const user = userEvent.setup()

    renderFormItem(defaultProps);

    const input = screen.getByLabelText('Username')

    await user.type(input, 'test')

    expect(input).toHaveValue('test')
  })

  it('renders the supplied input type', () => {
    renderFormItem({...defaultProps, title: "Password", type: "password"});

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    )
  })

  it('shows the error message when an error exists', () => {
    renderFormItem({
      ...defaultProps,
      error: {
        type: 'required',
        message: 'Username is required'
      }
    });

    expect(screen.getByText('Username is required')).toBeInTheDocument()
  })

  it('does not render an error message when there is no error', () => {
    renderFormItem(defaultProps)

    expect(screen.queryByText('Username is required')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toHaveClass('border-white')

  })

  it('applies the error border when an error exists', () => {
    renderFormItem({
      ...defaultProps,
      error: {
        type: 'required',
        message: 'Username is required'
      }
    });

    expect(screen.getByLabelText('Username')).toHaveClass('border-red-800')
  })
})