package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.service.SongService;
import com.personalProjects.songTrackerBackend.service.UserService;
import com.personalProjects.songTrackerBackend.service.UserSongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-songs")
public class UserSongController {

    @Autowired
    UserService userService;

    @Autowired
    SongService songService;

    @Autowired
    UserSongService userSongService;

    @GetMapping
    public ResponseEntity<List<UserSongDTO>> getAllSongs(Authentication authentication) {
        List<UserSongDTO> songs = userSongService.getUserSongs(authentication.getName());
        return ResponseEntity.ok(songs);
    }

    @PostMapping
    public ResponseEntity<UserSongDTO> saveSong(
            @RequestBody SaveSongRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        User user = userService.getUserByUsername(username).orElseThrow();

        Song song = songService.getOrCreateFromSpotify(request.spotifyId());

        UserSong userSong = userSongService.saveSong(user, song);

        return ResponseEntity.ok(userSong.toDTO());
    }
}