package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.controller.SpotifyController;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.service.SpotifyService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpotifyControllerTest {

    @Mock
    private SpotifyService spotifyService;

    @InjectMocks
    private SpotifyController spotifyController;


    @Test
    void shouldReturnSongsFromSpotifyService() throws Exception {

        List<SongSearchResult> songs = List.of(
                new SongSearchResult(
                        "spotify-id",
                        "Stick Season",
                        "Noah Kahan",
                        "Stick Season",
                        "image-url"
                )
        );


        when(spotifyService.searchTracks("stick season"))
                .thenReturn(songs);


        List<SongSearchResult> result =
                spotifyController.search("stick season");


        assertEquals(songs, result);

        verify(spotifyService)
                .searchTracks("stick season");
    }


    @Test
    void shouldReturnEmptyListWhenNoSongsFound() throws Exception {

        when(spotifyService.searchTracks("unknown"))
                .thenReturn(List.of());


        List<SongSearchResult> result =
                spotifyController.search("unknown");


        assertTrue(result.isEmpty());

        verify(spotifyService)
                .searchTracks("unknown");
    }


    @Test
    void shouldPropagateExceptionFromSpotifyService() throws Exception {

        when(spotifyService.searchTracks("error"))
                .thenThrow(new RuntimeException("Spotify unavailable"));


        Exception exception = assertThrows(
                RuntimeException.class,
                () -> spotifyController.search("error")
        );


        assertEquals(
                "Spotify unavailable",
                exception.getMessage()
        );
    }
}