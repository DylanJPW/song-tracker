package com.personalProjects.songTrackerBackend.spotify;

import com.personalProjects.songTrackerBackend.spotify.dto.SpotifyTokenResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class SpotifyTokenService {

    private String cachedToken;

    private Instant expiry;

    private boolean tokenStillValid() {
        return cachedToken != null
                && expiry != null
                && Instant.now().isBefore(expiry.minusSeconds(60));
    }

    private SpotifyTokenResponse requestNewToken() {

        return restClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .header(HttpHeaders.AUTHORIZATION, basicAuthHeader())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(SpotifyTokenResponse.class);
    }

    public String getAccessToken() {

        if (tokenStillValid()) {
            return cachedToken;
        }

        SpotifyTokenResponse response = requestNewToken();

        cachedToken = response.accessToken();
        expiry = Instant.now().plusSeconds(response.expiresIn());

        return cachedToken;
    }
}