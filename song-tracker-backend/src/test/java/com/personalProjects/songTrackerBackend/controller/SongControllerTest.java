package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.auth.JWTRequestFilter;
import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.service.SongService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = SongController.class,
        excludeFilters = {
                @ComponentScan.Filter(
                        type = FilterType.ASSIGNABLE_TYPE,
                        classes = JWTRequestFilter.class
                )
        }
)
@ActiveProfiles("test")
class SongControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SongService songService;

    @Test
    void getAllSongs_returnsAllSongs() throws Exception {
        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );
        song.setId(1L);

        when(songService.getAllSongs()).thenReturn(List.of(song));

        mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Test Song"))
                .andExpect(jsonPath("$[0].artist").value("Test Artist"))
                .andExpect(jsonPath("$[0].album").value("Test Album"))
                .andExpect(jsonPath("$[0].imageUrl").value("https://test.image"));

        verify(songService).getAllSongs();
    }

    @Test
    void getSong_existingSong_returnsSong() throws Exception {
        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );
        song.setId(1L);

        when(songService.getSong(1L)).thenReturn(Optional.of(song));

        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Song"))
                .andExpect(jsonPath("$.artist").value("Test Artist"))
                .andExpect(jsonPath("$.album").value("Test Album"))
                .andExpect(jsonPath("$.imageUrl").value("https://test.image"));

        verify(songService).getSong(1L);
    }

    @Test
    void getSong_missingSong_returns404() throws Exception {
        when(songService.getSong(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isNotFound());

        verify(songService).getSong(1L);
    }

    @Test
    void deleteSong_existingSong_returns200() throws Exception {
        when(songService.deleteSong(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/songs/1"))
                .andExpect(status().isOk());

        verify(songService).deleteSong(1L);
    }

    @Test
    void deleteSong_missingSong_returns404() throws Exception {
        when(songService.deleteSong(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/songs/1"))
                .andExpect(status().isNotFound());

        verify(songService).deleteSong(1L);
    }

    @Test
    void createSong_returnsCreatedSong() throws Exception {
        SongDTO dto = new SongDTO(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        Song created = new Song(
                dto.title(),
                dto.artist(),
                dto.album(),
                dto.imageUrl()
        );
        created.setId(5L);

        when(songService.createSong(any(Song.class))).thenReturn(created);

        mockMvc.perform(post("/api/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/songs/5"))
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.title").value("Test Song"))
                .andExpect(jsonPath("$.artist").value("Test Artist"))
                .andExpect(jsonPath("$.album").value("Test Album"))
                .andExpect(jsonPath("$.imageUrl").value("https://test.image"));

        verify(songService).createSong(any(Song.class));
    }

    @Test
    void updateSong_existingSong_returnsUpdatedSong() throws Exception {
        SongDTO dto = new SongDTO(
                "Test Updated Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        Song updated = new Song(
                dto.title(),
                dto.artist(),
                dto.album(),
                dto.imageUrl()
        );
        updated.setId(1L);

        when(songService.updateSong(
                eq(1L),
                any(SongDTO.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/songs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(songService).updateSong(eq(1L), any(SongDTO.class));
    }

    @Test
    void updateSong_missingSong_returns404() throws Exception {
        SongDTO dto = new SongDTO(
                "Test Updated Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        when(songService.updateSong(
                eq(1L),
                any(SongDTO.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/songs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(songService).updateSong(
                eq(1L),
                any(SongDTO.class));
    }
}