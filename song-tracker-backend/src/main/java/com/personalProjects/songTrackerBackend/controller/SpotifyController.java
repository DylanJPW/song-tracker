package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.service.SpotifyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {

    private final SpotifyService spotifyService;

    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/search")
    public List<SongSearchResult> search(
            @RequestParam String query) throws Exception {

        return spotifyService.searchTracks(query);
    }

    @GetMapping("/tracks/{spotifyId}")
    public SongSearchResult getTrack(
            @PathVariable String spotifyId) throws Exception {

        return spotifyService.getTrack(spotifyId);
    }
}