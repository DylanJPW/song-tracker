package com.personalProjects.songTrackerBackend.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class JWTUtilTest {

    @Autowired
    private JWTUtil jwtUtil;

    @Test
    void generateAndExtractUsername() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        String extracted = jwtUtil.extractUsername(token);
        assertEquals(username, extracted);
        assertTrue(jwtUtil.isTokenValid(token, username));
    }

    @Test
    void invalidUsernameFailsValidation() {
        String token = jwtUtil.generateToken("testUser");
        assertFalse(jwtUtil.isTokenValid(token, "other"));
    }

    @Test
    void expiredTokenIsInvalid() throws Exception {
        final String secret = "+UsmAq3XRPudPKF4Td+jcwryTp5+qIhZ3fE+0vO6rfBmjF831uIzRN9xGinkqvjTO8RANe7rq/TiTWNyp/j1Ew==";
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        Key key = Keys.hmacShaKeyFor(keyBytes);

        String token = Jwts.builder()
                .setSubject("expiredUser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10_000))
                .setExpiration(new Date(System.currentTimeMillis() - 5_000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        org.junit.jupiter.api.function.Executable call = () -> jwtUtil.isTokenValid(token, "expiredUser");
        org.junit.jupiter.api.Assertions.assertThrows(io.jsonwebtoken.ExpiredJwtException.class, call);
    }
}