package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserSongService {
    @Autowired
    private UserSongRepository userSongRepository;

    @Autowired
    private UserService userService;

    public UserSong saveSong(User user, Song song) {
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
        User user = userService.getUserByUsername(username)
                .orElseThrow();

        return userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedDesc(user.getUsername())
                .toDTO();
    }

    public UserSongDTO getOldestPractised(String username) {
        User user = userService.getUserByUsername(username)
                .orElseThrow();

        return userSongRepository.findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedAsc(user.getUsername())
                .toDTO();
    }

    public UserSongDTO getNewlyAdded(String username) {
        User user = userService.getUserByUsername(username)
                .orElseThrow();

        return userSongRepository.findFirstByUserUsernameAndStatusOrderByDateAdded(user.getUsername(), SongStatus.WANT_TO_LEARN)
                .toDTO();
    }

    public DashboardResponse getDashboard(String username) {
        return new DashboardResponse(
                getUserSongsByStatus(username, SongStatus.WANT_TO_LEARN),
                getUserSongsByStatus(username, SongStatus.LEARNING),
                getUserSongsByStatus(username, SongStatus.LEARNED),
                getMostRecentlyPractised(username),
                getOldestPractised(username),
                getNewlyAdded(username)
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