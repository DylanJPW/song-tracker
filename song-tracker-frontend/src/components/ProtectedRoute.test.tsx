import {render, screen} from '@testing-library/react'
import {MemoryRouter, Route, Routes} from 'react-router'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {type AuthContextType, useAuth} from '@/context/AuthContext'
import {ProtectedRoute} from './ProtectedRoute'

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('ProtectedRoute', () => {

  const renderProtectedRoute = () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<div>Home</div>} path='/'/>
          <Route element={<ProtectedRoute/>}>
            <Route element={<div>Protected Content</div>} path='/protected'/>
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders child route when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isLoggedIn: true
    } as AuthContextType)

    renderProtectedRoute()

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to home when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isLoggedIn: false
    } as AuthContextType)

    renderProtectedRoute()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})