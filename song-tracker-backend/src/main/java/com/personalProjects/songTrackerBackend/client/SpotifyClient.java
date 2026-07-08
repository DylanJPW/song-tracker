package com.personalProjects.songTrackerBackend.client;

import com.personalProjects.songTrackerBackend.service.SpotifyTokenService;
import org.springframework.stereotype.Component;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;

@Component
public class SpotifyClient {

    private final SpotifyApi spotifyApi;
    private final SpotifyTokenService tokenService;

    public SpotifyClient(
            SpotifyApi spotifyApi,
            SpotifyTokenService tokenService) {

        this.spotifyApi = spotifyApi;
        this.tokenService = tokenService;
    }

    public ClientCredentials getClientCredentials() throws Exception {
        return spotifyApi.clientCredentials()
                .build()
                .execute();
    }

    public Paging<Track> searchTracks(String query) throws Exception {

        SpotifyApi api = tokenService.getSpotifyApi();

        return api.searchTracks(query)
                .limit(10)
                .build()
                .execute();
    }


    public SpotifyApi getSpotifyApi() {
        return spotifyApi;
    }
}