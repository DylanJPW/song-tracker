package com.personalProjects.songTrackerBackend.unit.service;

import com.personalProjects.songTrackerBackend.client.SpotifyClient;
import com.personalProjects.songTrackerBackend.service.SpotifyTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpotifyTokenServiceTest {

    @Mock
    private SpotifyClient spotifyClient;

    @Mock
    private SpotifyApi spotifyApi;

    @InjectMocks
    private SpotifyTokenService spotifyTokenService;

    @Test
    void shouldRequestNewTokenWhenNoTokenExists() throws Exception {

        ClientCredentials credentials = mock(ClientCredentials.class);

        when(spotifyClient.getSpotifyApi())
                .thenReturn(spotifyApi);

        when(spotifyClient.getClientCredentials())
                .thenReturn(credentials);

        when(credentials.getAccessToken())
                .thenReturn("abc123");

        when(credentials.getExpiresIn())
                .thenReturn(3600);

        SpotifyApi result = spotifyTokenService.getSpotifyApi();

        assertEquals(spotifyApi, result);

        verify(spotifyApi)
                .setAccessToken("abc123");
    }

    @Test
    void shouldReuseExistingTokenWhenNotExpired() throws Exception {

        ClientCredentials credentials = mock(ClientCredentials.class);

        when(spotifyClient.getSpotifyApi())
                .thenReturn(spotifyApi);

        when(spotifyClient.getClientCredentials())
                .thenReturn(credentials);

        when(credentials.getAccessToken())
                .thenReturn("abc123");

        when(credentials.getExpiresIn())
                .thenReturn(3600);

        spotifyTokenService.getSpotifyApi();
        spotifyTokenService.getSpotifyApi();

        verify(spotifyClient, times(1))
                .getClientCredentials();
    }

    @Test
    void shouldRequestNewTokenWhenTokenExpired() throws Exception {

        ClientCredentials credentials = mock(ClientCredentials.class);

        when(spotifyClient.getSpotifyApi())
                .thenReturn(spotifyApi);

        when(spotifyClient.getClientCredentials())
                .thenReturn(credentials);

        when(credentials.getAccessToken())
                .thenReturn("abc123");

        when(credentials.getExpiresIn())
                .thenReturn(0);

        SpotifyApi result = spotifyTokenService.getSpotifyApi();

        assertEquals(spotifyApi, result);

        verify(spotifyApi)
                .setAccessToken("abc123");
    }
}