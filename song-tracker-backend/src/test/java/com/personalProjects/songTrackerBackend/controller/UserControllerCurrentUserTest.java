package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.auth.JWTUtil;
import com.personalProjects.songTrackerBackend.model.CurrentUserResponse;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserControllerCurrentUserTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController controller;

    @Test
    void returnsIdAndUsername_forTheLoggedInUser() {
        User user = new User("testuser", "hashed-password");
        user.setId(7L);

        when(authentication.getName()).thenReturn("testuser");
        when(userService.getUserByUsername("testuser")).thenReturn(Optional.of(user));

        ResponseEntity<CurrentUserResponse> response = controller.getCurrentUser(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(new CurrentUserResponse(7L, "testuser"), response.getBody());
    }

    @Test
    void returnsNotFound_whenTheTokenBelongsToADeletedUser() {
        when(authentication.getName()).thenReturn("deleted");
        when(userService.getUserByUsername("deleted")).thenReturn(Optional.empty());

        ResponseEntity<CurrentUserResponse> response = controller.getCurrentUser(authentication);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }
}