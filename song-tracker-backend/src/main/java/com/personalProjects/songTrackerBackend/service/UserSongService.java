package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.model.UserSong;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import com.personalProjects.songTrackerBackend.repository.UserSongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSongService {
    @Autowired
    private UserSongRepository userSongRepository;

    public UserSong saveSong(User user, Song song) {

        UserSong userSong = new UserSong(user, song, SongStatus.WANT_TO_LEARN);
        return userSongRepository.save(userSong);
    }
}