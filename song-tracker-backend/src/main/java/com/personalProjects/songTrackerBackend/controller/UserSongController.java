package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.service.SongService;
import com.personalProjects.songTrackerBackend.service.UserService;
import com.personalProjects.songTrackerBackend.service.UserSongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user-songs")
public class UserSongController {

    @Autowired
    UserService userService;

    @Autowired
    SongService songService;

    @Autowired
    UserSongService userSongService;

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