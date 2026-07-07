package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;

import java.util.Arrays;
import java.util.List;

@Service
public class SpotifyService {

    private final SpotifyTokenService tokenService;

    public SpotifyService(SpotifyTokenService tokenService) {
        this.tokenService = tokenService;
    }

    public List<SongSearchResult> searchTracks(String query) throws Exception {

        SpotifyApi spotifyApi = tokenService.getSpotifyApi();

        Paging<Track> paging = spotifyApi.searchTracks(query)
                .limit(10)
                .build()
                .execute();

        return Arrays.stream(paging.getItems())
                .map(this::mapTrack)
                .toList();
    }

    private SongSearchResult mapTrack(Track track) {

        return new SongSearchResult(
                track.getId(),
                track.getName(),
                track.getArtists()[0].getName(),
                track.getAlbum().getName(),
                track.getAlbum().getImages().length > 0
                        ? track.getAlbum().getImages()[0].getUrl()
                        : null
        );
    }
}