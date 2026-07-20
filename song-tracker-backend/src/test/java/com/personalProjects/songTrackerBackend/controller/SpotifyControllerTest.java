package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.auth.JWTRequestFilter;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.service.SpotifyService;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = SpotifyController.class,
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = JWTRequestFilter.class
                )
        }
)
@ActiveProfiles("test")
class SpotifyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SpotifyService spotifyService;

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

        mockMvc.perform(get("/api/spotify/search")
                        .param("query", "stick season")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("spotify-id"))
                .andExpect(jsonPath("$[0].title").value("Stick Season"))
                .andExpect(jsonPath("$[0].artist").value("Noah Kahan"));

        verify(spotifyService)
                .searchTracks("stick season");
    }

    @Test
    void shouldReturnEmptyListWhenNoSongsFound() throws Exception {

        when(spotifyService.searchTracks("unknown"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/spotify/search")
                        .param("query", "unknown")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(spotifyService)
                .searchTracks("unknown");
    }

    @Test
    void shouldPropagateExceptionFromSpotifyService() throws Exception {

        when(spotifyService.searchTracks("error"))
                .thenThrow(new RuntimeException("Spotify unavailable"));

        assertThrows(
                ServletException.class,
                () -> mockMvc.perform(get("/api/spotify/search")
                        .param("query", "error"))
        );

        verify(spotifyService)
                .searchTracks("error");
    }
}