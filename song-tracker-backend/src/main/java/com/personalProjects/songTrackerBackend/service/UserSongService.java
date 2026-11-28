package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UserSongService {
    private static final ZoneId ZONE = ZoneId.of("Europe/Dublin");

    private final UserSongRepository userSongRepository;
    private final UserService userService;
    private final Clock clock;

    public UserSongService(UserSongRepository userSongRepository, UserService userService, Clock clock) {
        this.userSongRepository = userSongRepository;
        this.userService = userService;
        this.clock = clock;
    }

    public UserSong saveSong(User user, Song song) {
        if (userSongRepository.existsByUserIdAndSongId(user.getId(), song.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You've already saved this song");
        }

        UserSong userSong = new UserSong(user, song, SongStatus.WANT_TO_LEARN);
        return userSongRepository.save(userSong);
    }

    public List<UserSongDTO> getUserSongs(String username) {

        User user = userService.getUserByUsername(username)
                .orElseThrow();

        return userSongRepository.findAllByUserId(user.getId())
                .stream()
                .map(UserSong::toDTO)
                .toList();
    }

    public List<UserSongDTO> getUserSongsByStatus(String username, SongStatus status) {
        User user = userService.getUserByUsername(username)
                .orElseThrow();

        return userSongRepository.findAllByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(UserSong::toDTO)
                .toList();
    }

    public UserSongDTO getMostRecentlyPractised(String username) {
        return userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedDesc(username)
                .map(UserSong::toDTO)
                .orElse(null);
    }

    public UserSongDTO getOldestPractised(String username) {
        return userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedAsc(username)
                .map(UserSong::toDTO)
                .orElse(null);
    }

    public UserSongDTO getNewlyAdded(String username) {
        return userSongRepository.findFirstByUserUsernameAndStatusOrderByDateAddedDesc(username, SongStatus.WANT_TO_LEARN)
                .map(UserSong::toDTO)
                .orElse(null);
    }

    public long getPractisedInLast30Days(String username) {
        Instant since = Instant.now(clock).minus(30, ChronoUnit.DAYS);
        return userSongRepository.countByUserUsernameAndLastPractisedAfter(username, since);
    }

    public MonthlyPractice getPractisedThisMonth(String username) {
        YearMonth thisMonth = YearMonth.now(clock.withZone(ZONE));
        Instant start = thisMonth.atDay(1).atStartOfDay(ZONE).toInstant();
        Instant end = thisMonth.plusMonths(1).atDay(1).atStartOfDay(ZONE).toInstant();

        long count = userSongRepository.countPractisedBetween(username, start, end);
        return new MonthlyPractice(thisMonth, count);
    }

    public long getSongCount(String username) {
        return userSongRepository.countByUserUsername(username);
    }

    public DashboardResponse getDashboard(String username) {
        return new DashboardResponse(
                getMostRecentlyPractised(username),
                getOldestPractised(username),
                getNewlyAdded(username),
                getPractisedInLast30Days(username),
                getPractisedThisMonth(username),
                getSongCount(username)
        );
    }

    @Transactional
    public UserSongDTO updateUserSong(
            Long id,
            UpdateUserSongRequest request,
            String username) {

        UserSong userSong = userSongRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No saved song with id " + id));

        if (request.status() != null) {
            userSong.setStatus(request.status());
        }
        if (request.capo() != null) {
            userSong.setCapo(request.capo());
        }
        if (request.difficultyRating() != null) {
            userSong.setDifficultyRating(request.difficultyRating());
        }
        if (request.lastPractised() != null) {
            userSong.setLastPractised(request.lastPractised());
        }

        return userSongRepository.save(userSong).toDTO();
    }
}