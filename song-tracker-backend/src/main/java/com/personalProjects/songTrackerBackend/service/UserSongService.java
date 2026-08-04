package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.model.UserSong;
import com.personalProjects.songTrackerBackend.model.UserSongDTO;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}