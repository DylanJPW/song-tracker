package com.personalProjects.songTrackerBackend.unit.controller;

import com.personalProjects.songTrackerBackend.controller.SongController;
import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.service.SongService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
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

@WebMvcTest(SongController.class)
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
                "Numb",
                "Linkin Park",
                List.of("https://spotify.com"),
                "Great song"
        );
        song.setId(1);
        song.setDateAdded(LocalDate.now());

        when(songService.getAllSongs()).thenReturn(List.of(song));

        mockMvc.perform(get("/api/songs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Numb"))
                .andExpect(jsonPath("$[0].artist").value("Linkin Park"));

        verify(songService).getAllSongs();
    }

    @Test
    void getSong_existingSong_returnsSong() throws Exception {
        Song song = new Song(
                "Numb",
                "Linkin Park",
                List.of(),
                ""
        );
        song.setId(1);

        when(songService.getSong(1)).thenReturn(Optional.of(song));

        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Numb"));

        verify(songService).getSong(1);
    }

    @Test
    void getSong_missingSong_returns404() throws Exception {
        when(songService.getSong(1)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isNotFound());

        verify(songService).getSong(1);
    }

    @Test
    void deleteSong_existingSong_returns200() throws Exception {
        when(songService.deleteSong(1)).thenReturn(true);

        mockMvc.perform(delete("/api/songs/1"))
                .andExpect(status().isOk());

        verify(songService).deleteSong(1);
    }

    @Test
    void deleteSong_missingSong_returns404() throws Exception {
        when(songService.deleteSong(1)).thenReturn(false);

        mockMvc.perform(delete("/api/songs/1"))
                .andExpect(status().isNotFound());

        verify(songService).deleteSong(1);
    }

    @Test
    void createSong_returnsCreatedSong() throws Exception {
        SongDTO dto = new SongDTO(
                "Numb",
                "Linkin Park",
                List.of("https://spotify.com"),
                "Great song"
        );

        Song created = new Song(
                dto.getName(),
                dto.getArtist(),
                dto.getLinks(),
                dto.getNotes()
        );
        created.setId(5);

        when(songService.createSong(any(Song.class))).thenReturn(created);

        mockMvc.perform(post("/api/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/songs/5"))
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.name").value("Numb"));

        verify(songService).createSong(any(Song.class));
    }

    @Test
    void updateSong_existingSong_returnsUpdatedSong() throws Exception {
        SongDTO dto = new SongDTO(
                "Updated",
                "Artist",
                List.of(),
                "Notes"
        );

        Song updated = new Song(
                dto.getName(),
                dto.getArtist(),
                dto.getLinks(),
                dto.getNotes()
        );
        updated.setId(1);

        when(songService.updateSong(
                eq(1),
                any(SongDTO.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/songs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(songService).updateSong(eq(1), any(SongDTO.class));
    }

    @Test
    void updateSong_missingSong_returns404() throws Exception {
        SongDTO dto = new SongDTO(
                "Updated",
                "Artist",
                List.of(),
                "Notes"
        );

        when(songService.updateSong(
                eq(1),
                any(SongDTO.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/songs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(songService).updateSong(
                eq(1),
                any(SongDTO.class));
    }
}