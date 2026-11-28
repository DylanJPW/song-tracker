package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.*;
import com.personalProjects.songTrackerBackend.service.SongService;
import com.personalProjects.songTrackerBackend.service.UserService;
import com.personalProjects.songTrackerBackend.service.UserSongService;
import jakarta.validation.Valid;
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

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(userSongService.getDashboard(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<UserSongDTO> saveSong(
            @Valid @RequestBody SaveSongRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        User user = userService.getUserByUsername(username).orElseThrow();

        Song song = songService.getOrCreateFromSpotify(request.spotifyId());

        UserSong userSong = userSongService.saveSong(user, song);

        return ResponseEntity.ok(userSong.toDTO());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserSongDTO> updateSong(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserSongRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                userSongService.updateUserSong(id, request, authentication.getName()));
    }
}