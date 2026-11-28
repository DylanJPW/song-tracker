package com.personalProjects.songTrackerBackend.auth;

import com.personalProjects.songTrackerBackend.service.SpotifyService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Runs real requests through the full Spring Security filter chain with an expired
 * token, which is what a returning user's browser sends after the token runs out.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExpiredTokenIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SpotifyService spotifyService;

    @Value("${security.jwt.secret-key}")
    private String jwtSecret;

    private String expiredToken() {
        return Jwts.builder()
                .subject("testuser")
                .issuedAt(new Date(System.currentTimeMillis() - 10_000))
                .expiration(new Date(System.currentTimeMillis() - 5_000))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)))
                .compact();
    }

    @Test
    void publicEndpointStillWorksWithAnExpiredToken() throws Exception {
        when(spotifyService.searchTracks("stick season")).thenReturn(List.of());

        mockMvc.perform(get("/api/spotify/search")
                        .param("query", "stick season")
                        .header("Authorization", "Bearer " + expiredToken()))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpointReturns401WithAnExpiredToken() throws Exception {
        mockMvc.perform(get("/api/users/currentUser")
                        .header("Authorization", "Bearer " + expiredToken()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointReturns401WithAGarbageToken() throws Exception {
        mockMvc.perform(get("/api/users/currentUser")
                        .header("Authorization", "Bearer null"))
                .andExpect(status().isUnauthorized());
    }
}
