package com.personalProjects.songTrackerBackend.unit.service;

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
                List.of("test", "link"),
                "Test note"
        );
        song.setId(0);
        LocalDate fixedDate = LocalDate.of(2026, 1, 1);
        song.setDateAdded(fixedDate);

        when(songRepository.findById(0)).thenReturn(Optional.of(song));

        Optional<Song> result = songService.getSong(0);

        assertTrue(result.isPresent());
        assertEquals(0, result.get().getId());
        assertEquals("Test Song", result.get().getName());
        assertEquals("Test Artist", result.get().getArtist());
        assertEquals(fixedDate, result.get().getDateAdded());
        assertEquals(List.of("test", "link"), result.get().getLinks());
        assertEquals("Test note", result.get().getNotes());
        verify(songRepository).findById(0);
    }

    @Test
    void shouldReturnEmptyWhenSongNotFound() {
        when(songRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Song> result = songService.getSong(1);

        assertTrue(result.isEmpty());
    }

    // deleteSong
    @Test
    void shouldDeleteSongWhenExists() {
        when(songRepository.existsById(1)).thenReturn(true);

        boolean result = songService.deleteSong(1);

        assertTrue(result);
        verify(songRepository).deleteById(1);
    }

    @Test
    void shouldNotDeleteSongWhenNotExists() {
        when(songRepository.existsById(1)).thenReturn(false);

        boolean result = songService.deleteSong(1);

        assertFalse(result);
        verify(songRepository, never()).deleteById(anyInt());
    }

    // createSong
    @Test
    void shouldReturnNullWhenSongAlreadyExists() {
        Song song = new Song();
        song.setId(1);

        when(songRepository.existsById(1)).thenReturn(true);

        Song result = songService.createSong(song);

        assertNull(result);
        verify(songRepository, never()).save(any());
    }

    @Test
    void shouldCreateSongWhenIdDoesNotExist() {
        Song song = new Song();
        song.setId(1);

        when(songRepository.existsById(1)).thenReturn(false);
        when(songRepository.save(song)).thenReturn(song);

        Song result = songService.createSong(song);

        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(songRepository).save(song);
    }

    // updateSong
    @Test
    void shouldUpdateSongWhenFound() {
        Song song = new Song(
                "Test Song",
                "Test Artist",
                List.of("test", "link"),
                "Test note"
        );
        song.setId(0);
        LocalDate fixedDate = LocalDate.of(2026, 1, 1);
        song.setDateAdded(fixedDate);

        SongDTO dto = new SongDTO();
        dto.setName("New Song");
        dto.setArtist("New Artist");
        dto.setLinks(List.of("new", "link"));
        dto.setNotes("New note");

        when(songRepository.findById(0)).thenReturn(Optional.of(song));
        when(songRepository.save(any(Song.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Song> result = songService.updateSong(0, dto);

        assertTrue(result.isPresent());
        assertEquals("New Song", result.get().getName());
        assertEquals("New Artist", result.get().getArtist());
        assertEquals(List.of("new", "link"), result.get().getLinks());
        assertEquals("New note", result.get().getNotes());

        verify(songRepository).save(song);
    }

    @Test
    void shouldReturnEmptyWhenUpdatingMissingSong() {
        SongDTO dto = new SongDTO();
        dto.setName("Test");

        when(songRepository.findById(0)).thenReturn(Optional.empty());

        Optional<Song> result = songService.updateSong(0, dto);

        assertTrue(result.isEmpty());
        verify(songRepository, never()).save(any());
    }
}