package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.client.SpotifyClient;
import org.springframework.stereotype.Service;

import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;

import java.time.Instant;

@Service
public class SpotifyTokenService {

    private final SpotifyClient spotifyClient;

    private Instant expiresAt;

    public SpotifyTokenService(SpotifyClient spotifyClient) {
        this.spotifyClient = spotifyClient;
    }

    public SpotifyApi getSpotifyApi() throws Exception {

        SpotifyApi spotifyApi = spotifyClient.getSpotifyApi();

        if (expiresAt == null || Instant.now().isAfter(expiresAt)) {

            ClientCredentials credentials =
                    spotifyClient.getClientCredentials();

            spotifyApi.setAccessToken(credentials.getAccessToken());

            expiresAt = Instant.now()
                    .plusSeconds(credentials.getExpiresIn() - 60);
        }

        return spotifyApi;
    }
}