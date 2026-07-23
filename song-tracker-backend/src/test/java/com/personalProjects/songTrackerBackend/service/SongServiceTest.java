package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import com.personalProjects.songTrackerBackend.service.SongService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class SongServiceTest {

    @Mock
    private SongRepository songRepository;

    @InjectMocks
    private SongService songService;

    // getAllSongs
    @Test
    void shouldReturnAllSongs() {
        List<Song> songs = List.of(
                new Song(),
                new Song()
        );

        when(songRepository.findAll()).thenReturn(songs);

        List<Song> result = songService.getAllSongs();

        assertEquals(2, result.size());
        verify(songRepository, times(1)).findAll();
    }

    // getSong
    @Test
    void shouldReturnSongById() {
        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );
        song.setId(1L);

        when(songRepository.findById(1L)).thenReturn(Optional.of(song));

        Optional<Song> result = songService.getSong(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Test Song", result.get().getTitle());
        assertEquals("Test Artist", result.get().getArtist());
        assertEquals("Test Album", result.get().getAlbum());
        assertEquals("https://test.image", result.get().getImageUrl());
        verify(songRepository).findById(1L);
    }

    @Test
    void shouldReturnEmptyWhenSongNotFound() {
        when(songRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Song> result = songService.getSong(1L);

        assertTrue(result.isEmpty());
    }

    // deleteSong
    @Test
    void shouldDeleteSongWhenExists() {
        when(songRepository.existsById(1L)).thenReturn(true);

        boolean result = songService.deleteSong(1L);

        assertTrue(result);
        verify(songRepository).deleteById(1L);
    }

    @Test
    void shouldNotDeleteSongWhenDoesNotExists() {
        when(songRepository.existsById(1L)).thenReturn(false);

        boolean result = songService.deleteSong(1L);

        assertFalse(result);
        verify(songRepository, never()).deleteById(anyLong());
    }

    // createSong
    @Test
    void shouldReturnNullWhenSongAlreadyExists() {
        Song song = new Song();
        song.setId(1L);

        when(songRepository.existsById(1L)).thenReturn(true);

        Song result = songService.createSong(song);

        assertNull(result);
        verify(songRepository, never()).save(any());
    }

    @Test
    void shouldCreateSongWhenIdDoesNotExist() {
        Song song = new Song();
        song.setId(1L);

        when(songRepository.existsById(1L)).thenReturn(false);
        when(songRepository.save(song)).thenReturn(song);

        Song result = songService.createSong(song);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(songRepository).save(song);
    }

    // updateSong
    @Test
    void shouldUpdateSongWhenFound() {
        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );
        song.setId(1L);

        SongDTO dto = new SongDTO("New Song", "New Artist",  "New Album", "https://test.image");

        when(songRepository.findById(1L)).thenReturn(Optional.of(song));
        when(songRepository.save(any(Song.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Song> result = songService.updateSong(1L, dto);

        assertTrue(result.isPresent());
        assertEquals("New Song", result.get().getTitle());
        assertEquals("New Artist", result.get().getArtist());
        assertEquals("New Album", result.get().getAlbum());
        assertEquals("https://new.image", result.get().getImageUrl());

        verify(songRepository).save(song);
    }

    @Test
    void shouldReturnEmptyWhenUpdatingMissingSong() {
        SongDTO dto = new SongDTO("Test Song", "Test Artist", "Test Album", "https://test.image");

        when(songRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Song> result = songService.updateSong(1L, dto);

        assertTrue(result.isEmpty());
        verify(songRepository, never()).save(any());
    }
}