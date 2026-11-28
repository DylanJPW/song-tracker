package com.personalProjects.songTrackerBackend.auth;

import com.personalProjects.songTrackerBackend.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.IOException;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JWTRequestFilterTest {

    private JWTRequestFilter filter;
    private UserService userService;
    private JWTUtil jwtUtil;

    @BeforeEach
    void setUp() throws Exception {
        filter = new JWTRequestFilter();
        userService = mock(UserService.class);
        jwtUtil = mock(JWTUtil.class);

        Field userServiceField = JWTRequestFilter.class.getDeclaredField("userService");
        userServiceField.setAccessible(true);
        userServiceField.set(filter, userService);

        Field jwtUtilField = JWTRequestFilter.class.getDeclaredField("jwtUtil");
        jwtUtilField.setAccessible(true);
        jwtUtilField.set(filter, jwtUtil);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void whenNoAuthHeader_thenChainContinues() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void whenValidToken_thenAuthenticationSet() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn("Bearer token123");
        when(jwtUtil.extractUsername("token123")).thenReturn("testUser");

        UserDetails userDetails = User.builder()
                .username("testUser")
                .password("encoded")
                .roles()
                .build();

        when(userService.loadUserByUsername("testUser")).thenReturn(userDetails);
        when(jwtUtil.isTokenValid("token123", "testUser")).thenReturn(true);

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("testUser", SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void whenTokenExpired_thenChainContinuesUnauthenticated() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn("Bearer expired-token");
        when(jwtUtil.extractUsername("expired-token"))
                .thenThrow(new ExpiredJwtException(null, null, "JWT expired"));

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoInteractions(userService);
    }

    @Test
    void whenTokenMalformed_thenChainContinuesUnauthenticated() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn("Bearer null");
        when(jwtUtil.extractUsername("null"))
                .thenThrow(new MalformedJwtException("Invalid compact JWT string"));

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void whenTokenBelongsToDeletedUser_thenChainContinuesUnauthenticated() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn("Bearer token123");
        when(jwtUtil.extractUsername("token123")).thenReturn("deletedUser");
        when(userService.loadUserByUsername("deletedUser"))
                .thenThrow(new UsernameNotFoundException("User not found"));

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void whenTokenFailsValidation_thenNoAuthenticationSet() throws ServletException, IOException {
        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn("Bearer token123");
        when(jwtUtil.extractUsername("token123")).thenReturn("testUser");
        when(userService.loadUserByUsername("testUser")).thenReturn(User.builder()
                .username("testUser")
                .password("encoded")
                .roles()
                .build());
        when(jwtUtil.isTokenValid("token123", "testUser")).thenReturn(false);

        filter.doFilterInternal(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
