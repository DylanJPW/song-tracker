package com.personalProjects.songTrackerBackend.spotify;

import com.personalProjects.songTrackerBackend.spotify.dto.SpotifySearchResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SpotifyClient {

    private final RestClient restClient;

    public SpotifyClient(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public SpotifySearchResponse searchTracks(
            String query,
            String accessToken) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.spotify.com")
                        .path("/v1/search")
                        .queryParam("q", query)
                        .queryParam("type", "track")
                        .queryParam("limit", 10)
                        .build())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(SpotifySearchResponse.class);
    }
}