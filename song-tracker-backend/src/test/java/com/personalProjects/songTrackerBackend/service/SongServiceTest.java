package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SongServiceTest {

    @Mock
    private SongRepository songRepository;

    @Mock
    private SpotifyService spotifyService;

    @InjectMocks
    private SongService songService;

    // getOrCreateFromSpotify
    @Test
    void shouldReturnSavedSongWithoutCallingSpotifyWhenAlreadyStored() throws Exception {
        Song existing = new Song(
                "spotify-a",
                "Stick Season",
                "Noah Kahan",
                "Stick Season",
                "https://test.image"
        );
        existing.setId(1L);

        when(songRepository.findBySpotifyId("spotify-a")).thenReturn(Optional.of(existing));

        Song result = songService.getOrCreateFromSpotify("spotify-a");

        assertSame(existing, result);
        verifyNoInteractions(spotifyService);
        verify(songRepository, never()).save(any());
    }

    @Test
    void shouldFetchFromSpotifyAndSaveWhenNotStored() throws Exception {
        SongSearchResult track = new SongSearchResult(
                "spotify-a",
                "Stick Season",
                "Noah Kahan",
                "Stick Season",
                "https://test.image"
        );

        when(songRepository.findBySpotifyId("spotify-a")).thenReturn(Optional.empty());
        when(spotifyService.getTrack("spotify-a")).thenReturn(track);
        when(songRepository.save(any(Song.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Song result = songService.getOrCreateFromSpotify("spotify-a");

        ArgumentCaptor<Song> saved = ArgumentCaptor.forClass(Song.class);
        verify(songRepository).save(saved.capture());

        assertSame(saved.getValue(), result);
        assertEquals("spotify-a", result.getSpotifyId());
        assertEquals("Stick Season", result.getTitle());
        assertEquals("Noah Kahan", result.getArtist());
        assertEquals("Stick Season", result.getAlbum());
        assertEquals("https://test.image", result.getImageUrl());
    }

    @Test
    void shouldNotSaveAnythingWhenSpotifyLookupFails() throws Exception {
        when(songRepository.findBySpotifyId("spotify-a")).thenReturn(Optional.empty());
        IOException spotifyError = new IOException("Spotify is down");
        when(spotifyService.getTrack("spotify-a")).thenThrow(spotifyError);

        RuntimeException thrown = assertThrows(
                RuntimeException.class,
                () -> songService.getOrCreateFromSpotify("spotify-a")
        );

        assertSame(spotifyError, thrown.getCause());
        verify(songRepository, never()).save(any());
    }
}