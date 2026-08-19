import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {AlbumArt, SongCard} from './SongCard'

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

  it('renders the album art at card size', () => {
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
    expect(image).toHaveAttribute('width', '100')
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

describe('AlbumArt', () => {
  it('describes the art by album, so it does not repeat an adjacent title', () => {
    render(<AlbumArt album='Album A' className='rounded-sm' imageUrl='https://test.image/a.jpg' size={320}/>)

    const image = screen.getByRole('img', {name: 'Album art for Album A'})

    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('width', '320')
    expect(image).toHaveAttribute('height', '320')
  })

  it('applies the caller className to the image', () => {
    render(<AlbumArt album='Album A' className='w-full' imageUrl='https://test.image/a.jpg' size={320}/>)

    expect(screen.getByRole('img', {name: 'Album art for Album A'})).toHaveClass('w-full')
  })

  it('applies the caller className to the placeholder too, so it keeps its shape', () => {
    const {container} = render(
      <AlbumArt album='Album A' className='aspect-square w-full' imageUrl={null} size={320}/>
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass('aspect-square')
  })
})