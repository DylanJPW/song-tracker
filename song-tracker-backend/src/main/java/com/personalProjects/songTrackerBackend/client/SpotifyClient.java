package com.personalProjects.songTrackerBackend.client;

import org.springframework.stereotype.Component;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;

import java.time.Instant;

@Component
public class SpotifyClient {

    private final SpotifyApi spotifyApi;

    private Instant expiresAt;

    public SpotifyClient(SpotifyApi spotifyApi) {

        this.spotifyApi = spotifyApi;
    }

    public SpotifyApi getSpotifyApi() throws Exception {

        if (expiresAt == null || Instant.now().isAfter(expiresAt)) {

            ClientCredentials credentials =
                    spotifyApi.clientCredentials()
                            .build()
                            .execute();

            spotifyApi.setAccessToken(credentials.getAccessToken());

            expiresAt = Instant.now()
                    .plusSeconds(credentials.getExpiresIn() - 60);
        }

        return spotifyApi;
    }

    public ClientCredentials getClientCredentials() throws Exception {
        return spotifyApi.clientCredentials()
                .build()
                .execute();
    }

    public Paging<Track> searchTracks(String query) throws Exception {

        SpotifyApi api = getSpotifyApi();

        return api.searchTracks(query)
                .limit(10)
                .build()
                .execute();
    }
}