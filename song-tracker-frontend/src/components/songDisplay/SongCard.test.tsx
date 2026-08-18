import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SongCard} from './SongCard'

describe('SongCard', () => {
  it('renders the title, album and artist', () => {
    render(
      <SongCard
        album='Album A'
        artist='Artist A'
        imageUrl='https://test.image/a.jpg'
        title='Song A'
      />
    )

    expect(screen.getByText('Song A')).toBeInTheDocument()
    expect(screen.getByText('Album A')).toBeInTheDocument()
    expect(screen.getByText('Artist A')).toBeInTheDocument()
  })

  it('renders the album art with a description that does not repeat the title', () => {
    render(
      <SongCard
        album='Album A'
        artist='Artist A'
        imageUrl='https://test.image/a.jpg'
        title='Song A'
      />
    )

    const image = screen.getByRole('img', {name: 'Album art for Album A'})

    expect(image).toHaveAttribute('src', 'https://test.image/a.jpg')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('renders a placeholder instead of a broken image when there is no album art', () => {
    render(<SongCard album='Album A' artist='Artist A' imageUrl={null} title='Song A'/>)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Song A')).toBeInTheDocument()
  })

  it('renders children alongside the song information', () => {
    render(
      <SongCard album='Album A' artist='Artist A' imageUrl={null} title='Song A'>
        <span>Extra detail</span>
      </SongCard>
    )

    expect(screen.getByText('Extra detail')).toBeInTheDocument()
  })
})