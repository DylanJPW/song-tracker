package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
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

    private static final Clock FIXED_CLOCK =
            Clock.fixed(Instant.parse("2026-11-27T12:00:00Z"), ZoneOffset.UTC);

    private UserSongService userSongService;

    @BeforeEach
    void setUp() {
        userSongService = new UserSongService(userSongRepository, userService, FIXED_CLOCK);
    }

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
    void shouldRejectSavingTheSameSongTwice() {
        User user = new User();
        user.setId(1L);

        Song song = new Song(
                "Test Song",
                "Test Artist",
                "Test Album",
                "https://test.image"
        );
        song.setId(2L);

        when(userSongRepository.existsByUserIdAndSongId(1L, 2L)).thenReturn(true);

        ResponseStatusException thrown = assertThrows(
                ResponseStatusException.class,
                () -> userSongService.saveSong(user, song)
        );

        assertEquals(HttpStatus.CONFLICT, thrown.getStatusCode());
        verify(userSongRepository, never()).save(any());
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
                        new UpdateUserSongRequest(SongStatus.LEARNED, null, null, null),
                        "attacker"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void updateUserSong_setsLastPractised_whenProvided() {
        UserSong userSong = buildUserSong(SongStatus.LEARNING);
        Instant practisedAt = Instant.parse("2026-11-27T10:00:00Z");

        when(userSongRepository.findByIdAndUserUsername(1L, "testuser"))
                .thenReturn(Optional.of(userSong));
        when(userSongRepository.save(any(UserSong.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserSongDTO result = userSongService.updateUserSong(
                1L,
                new UpdateUserSongRequest(null, null, null, practisedAt),
                "testuser");

        assertEquals(practisedAt, result.lastPractised());
        assertEquals(SongStatus.LEARNING, result.status());
    }

    @Test
    void updateUserSong_keepsLastPractised_whenNotProvided() {
        UserSong userSong = buildUserSong(SongStatus.LEARNING);
        Instant earlier = Instant.parse("2026-11-01T09:00:00Z");
        userSong.setLastPractised(earlier);

        when(userSongRepository.findByIdAndUserUsername(1L, "testuser"))
                .thenReturn(Optional.of(userSong));
        when(userSongRepository.save(any(UserSong.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserSongDTO result = userSongService.updateUserSong(
                1L,
                new UpdateUserSongRequest(SongStatus.LEARNED, null, null, null),
                "testuser");

        assertEquals(earlier, result.lastPractised());
        assertEquals(SongStatus.LEARNED, result.status());
    }

    @Nested
    class Dashboard {

        @Test
        void returnsNullSongsAndZeroCounts_forAnEmptyLibrary() {
            when(userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedDesc("testuser"))
                    .thenReturn(Optional.empty());
            when(userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedAsc("testuser"))
                    .thenReturn(Optional.empty());
            when(userSongRepository.findFirstByUserUsernameAndStatusOrderByDateAddedDesc("testuser", SongStatus.WANT_TO_LEARN))
                    .thenReturn(Optional.empty());
            when(userSongRepository.countByUserUsernameAndLastPractisedAfter(eq("testuser"), any(Instant.class)))
                    .thenReturn(0L);
            when(userSongRepository.countPractisedBetween(eq("testuser"), any(Instant.class), any(Instant.class)))
                    .thenReturn(0L);
            when(userSongRepository.countByUserUsername("testuser"))
                    .thenReturn(0L);

            DashboardResponse result = userSongService.getDashboard("testuser");

            assertNull(result.mostRecentlyPractised());
            assertNull(result.oldestPractised());
            assertNull(result.newlyAdded());
            assertEquals(0L, result.practisedInLast30Days());
            assertEquals(new MonthlyPractice(YearMonth.of(2026, 11), 0L), result.practisedThisMonth());
            assertEquals(0L, result.songCount());
        }

        @Test
        void returnsEachSuggestedSongAndCount() {
            UserSong recent = buildUserSong(SongStatus.LEARNING);
            UserSong oldest = buildUserSong(SongStatus.LEARNED);
            UserSong newest = buildUserSong(SongStatus.WANT_TO_LEARN);

            when(userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedDesc("testuser"))
                    .thenReturn(Optional.of(recent));
            when(userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedAsc("testuser"))
                    .thenReturn(Optional.of(oldest));
            when(userSongRepository.findFirstByUserUsernameAndStatusOrderByDateAddedDesc("testuser", SongStatus.WANT_TO_LEARN))
                    .thenReturn(Optional.of(newest));
            when(userSongRepository.countByUserUsernameAndLastPractisedAfter(eq("testuser"), any(Instant.class)))
                    .thenReturn(4L);
            when(userSongRepository.countPractisedBetween(eq("testuser"), any(Instant.class), any(Instant.class)))
                    .thenReturn(2L);
            when(userSongRepository.countByUserUsername("testuser"))
                    .thenReturn(12L);

            DashboardResponse result = userSongService.getDashboard("testuser");

            assertEquals(SongStatus.LEARNING, result.mostRecentlyPractised().status());
            assertEquals(SongStatus.LEARNED, result.oldestPractised().status());
            assertEquals(SongStatus.WANT_TO_LEARN, result.newlyAdded().status());
            assertEquals(4L, result.practisedInLast30Days());
            assertEquals(2L, result.practisedThisMonth().count());
            assertEquals(12L, result.songCount());
        }

        @Test
        void practisedInLast30Days_countsFromExactly30DaysBeforeNow() {
            when(userSongRepository.countByUserUsernameAndLastPractisedAfter(
                    "testuser", Instant.parse("2026-10-28T12:00:00Z")))
                    .thenReturn(3L);

            assertEquals(3L, userSongService.getPractisedInLast30Days("testuser"));
        }

        @Test
        void practisedThisMonth_usesIrishMonthBoundaries_inWinter() {
            when(userSongRepository.countPractisedBetween(
                    "testuser",
                    Instant.parse("2026-11-01T00:00:00Z"),
                    Instant.parse("2026-12-01T00:00:00Z")))
                    .thenReturn(5L);

            MonthlyPractice result = userSongService.getPractisedThisMonth("testuser");

            assertEquals(new MonthlyPractice(YearMonth.of(2026, 11), 5L), result);
        }

        @Test
        void practisedThisMonth_usesIrishMonthBoundaries_inSummer() {
            UserSongService summerService = new UserSongService(
                    userSongRepository,
                    userService,
                    Clock.fixed(Instant.parse("2026-07-31T23:30:00Z"), ZoneOffset.UTC));

            when(userSongRepository.countPractisedBetween(
                    "testuser",
                    Instant.parse("2026-07-31T23:00:00Z"),
                    Instant.parse("2026-08-31T23:00:00Z")))
                    .thenReturn(1L);

            MonthlyPractice result = summerService.getPractisedThisMonth("testuser");

            assertEquals(new MonthlyPractice(YearMonth.of(2026, 8), 1L), result);
        }
    }

    private static UserSong buildUserSong(SongStatus status) {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        Song song = new Song("Test Song", "Test Artist", "Test Album", "https://test.image");

        return new UserSong(user, song, status);
    }
}