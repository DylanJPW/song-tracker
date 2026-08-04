package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.service.SongService;
import com.personalProjects.songTrackerBackend.service.UserService;
import com.personalProjects.songTrackerBackend.service.UserSongService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserSongControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private SongService songService;

    @Mock
    private UserSongService userSongService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserSongController controller;

    @Test
    void getAllSongs_returnsUserSongs() {

        SongDTO songDTO = new SongDTO(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        UserSongDTO dto = new UserSongDTO(
                songDTO,
                SongStatus.WANT_TO_LEARN,
                null,
                null
        );

        when(authentication.getName()).thenReturn("test");
        when(userSongService.getUserSongs("test"))
                .thenReturn(List.of(dto));

        ResponseEntity<List<UserSongDTO>> response =
                controller.getAllSongs(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());

        UserSongDTO result = response.getBody().get(0);

        assertEquals("Test Song", result.song().title());
        assertEquals("Test Artist", result.song().artist());
        assertEquals("Test Album", result.song().album());
        assertEquals("https://test.image", result.song().imageUrl());
        assertEquals(SongStatus.WANT_TO_LEARN, result.status());

        verify(authentication).getName();
        verify(userSongService).getUserSongs("test");
    }

    @Test
    void saveSong_returnsSavedSong() {

        User user = new User();
        user.setId(1L);
        user.setUsername("test");

        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        UserSong userSong = new UserSong(
                user,
                song,
                SongStatus.WANT_TO_LEARN
        );

        SaveSongRequest request = new SaveSongRequest("spotify123");

        when(authentication.getName()).thenReturn("test");
        when(userService.getUserByUsername("test"))
                .thenReturn(Optional.of(user));
        when(songService.getOrCreateFromSpotify("spotify123"))
                .thenReturn(song);
        when(userSongService.saveSong(user, song))
                .thenReturn(userSong);

        ResponseEntity<UserSongDTO> response =
                controller.saveSong(request, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        UserSongDTO dto = response.getBody();

        assertEquals("Test Song", dto.song().title());
        assertEquals("Test Artist", dto.song().artist());
        assertEquals("Test Album", dto.song().album());
        assertEquals("https://test.image", dto.song().imageUrl());
        assertEquals(SongStatus.WANT_TO_LEARN, dto.status());

        verify(authentication).getName();
        verify(userService).getUserByUsername("test");
        verify(songService).getOrCreateFromSpotify("spotify123");
        verify(userSongService).saveSong(user, song);
    }
}