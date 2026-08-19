package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserSongServiceTest {

    @Mock
    private UserSongRepository userSongRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserSongService userSongService;

    @Test
    void shouldSaveSongForUser() {
        User user = new User();
        user.setId(1L);

        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        when(userSongRepository.save(any(UserSong.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserSong result = userSongService.saveSong(user, song);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(song, result.getSong());
        assertEquals(SongStatus.WANT_TO_LEARN, result.getStatus());

        verify(userSongRepository).save(any(UserSong.class));
    }

    @Test
    void shouldReturnUserSongs() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );

        UserSong userSong = new UserSong(user, song, SongStatus.WANT_TO_LEARN);

        when(userService.getUserByUsername("testuser"))
                .thenReturn(Optional.of(user));

        when(userSongRepository.findAllByUserId(1L))
                .thenReturn(List.of(userSong));

        List<UserSongDTO> result = userSongService.getUserSongs("testuser");

        assertEquals(1, result.size());

        UserSongDTO dto = result.getFirst();

        assertEquals("Test Song", dto.song().title());
        assertEquals("Test Artist", dto.song().artist());
        assertEquals("Test Album", dto.song().album());
        assertEquals("https://test.image", dto.song().imageUrl());
        assertEquals(SongStatus.WANT_TO_LEARN, dto.status());

        verify(userService).getUserByUsername("testuser");
        verify(userSongRepository).findAllByUserId(1L);
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoSongs() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        when(userService.getUserByUsername("testuser"))
                .thenReturn(Optional.of(user));

        when(userSongRepository.findAllByUserId(1L))
                .thenReturn(List.of());

        List<UserSongDTO> result = userSongService.getUserSongs("testuser");

        assertTrue(result.isEmpty());

        verify(userSongRepository).findAllByUserId(1L);
    }

    @Test
    void shouldThrowWhenUserDoesNotExist() {
        when(userService.getUserByUsername("missingUser"))
                .thenReturn(Optional.empty());

        assertThrows(
                NoSuchElementException.class,
                () -> userSongService.getUserSongs("missingUser")
        );

        verify(userSongRepository, never()).findAllByUserId(anyLong());
    }

    @Test
    void updateUserSong_throwsNotFound_whenSongBelongsToAnotherUser() {
        when(userSongRepository.findByIdAndUserUsername(1L, "attacker"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> userSongService.updateUserSong(
                        1L,
                        new UpdateUserSongRequest(SongStatus.LEARNED, null, null),
                        "attacker"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }
}