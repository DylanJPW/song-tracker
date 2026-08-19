import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {StatusControl} from './StatusControl'

describe('StatusControl', () => {
  it('offers all three statuses by their labels', () => {
    render(<StatusControl isPending={false} onChange={vi.fn()} status='WANT_TO_LEARN'/>)

    expect(screen.getByRole('button', {name: 'Want to learn'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Learning'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Learned'})).toBeInTheDocument()
    expect(screen.queryByText('WANT_TO_LEARN')).not.toBeInTheDocument()
  })

  it('marks only the current status as pressed', () => {
    render(<StatusControl isPending={false} onChange={vi.fn()} status='LEARNING'/>)

    expect(screen.getByRole('button', {name: 'Learning', pressed: true})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Want to learn', pressed: false})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Learned', pressed: false})).toBeInTheDocument()
  })

  it('reports the status that was clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<StatusControl isPending={false} onChange={onChange} status='WANT_TO_LEARN'/>)

    await user.click(screen.getByRole('button', {name: 'Learned'}))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('LEARNED')
  })

  it('disables every option while a change is in flight', () => {
    render(<StatusControl isPending={true} onChange={vi.fn()} status='WANT_TO_LEARN'/>)

    expect(screen.getByRole('button', {name: 'Want to learn'})).toBeDisabled()
    expect(screen.getByRole('button', {name: 'Learning'})).toBeDisabled()
    expect(screen.getByRole('button', {name: 'Learned'})).toBeDisabled()
  })

  it('does not report a change while disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<StatusControl isPending={true} onChange={onChange} status='WANT_TO_LEARN'/>)

    await user.click(screen.getByRole('button', {name: 'Learning'}))

    expect(onChange).not.toHaveBeenCalled()
  })
})