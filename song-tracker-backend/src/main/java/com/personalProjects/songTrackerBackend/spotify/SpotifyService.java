package com.personalProjects.songTrackerBackend.spotify;

import com.personalProjects.songTrackerBackend.spotify.dto.SongSearchResult;
import com.personalProjects.songTrackerBackend.spotify.dto.SpotifySearchResponse;
import com.personalProjects.songTrackerBackend.spotify.dto.SpotifyTrack;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpotifyService {

    private final SpotifyClient spotifyClient;
    private final SpotifyTokenService tokenService;

    public SpotifyService(
            SpotifyClient spotifyClient,
            SpotifyTokenService tokenService) {

        this.spotifyClient = spotifyClient;
        this.tokenService = tokenService;
    }

    public List<SongSearchResult> searchTracks(String query) {

        String token = tokenService.getAccessToken();

        SpotifySearchResponse response =
                spotifyClient.searchTracks(query, token);

        return response.tracks()
                .items()
                .stream()
                .map(this::toSongSearchResult)
                .toList();
    }

    private SongSearchResult toSongSearchResult(SpotifyTrack track) {

        return new SongSearchResult(
                track.id(),
                track.name(),
                track.artists().getFirst().name(),
                track.album().name(),
                track.album().images().isEmpty()
                        ? null
                        : track.album().images().getFirst().url()
        );
    }
}