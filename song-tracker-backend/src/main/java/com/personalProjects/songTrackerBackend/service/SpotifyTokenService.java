package com.personalProjects.songTrackerBackend.service;

import org.springframework.stereotype.Service;

import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;

import java.time.Instant;

@Service
public class SpotifyTokenService {

    private final SpotifyApi spotifyApi;

    private Instant expiresAt;

    public SpotifyTokenService(SpotifyApi spotifyApi) {
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
}