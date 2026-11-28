package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.model.UserDTO;
import com.personalProjects.songTrackerBackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @MockitoBean
    private com.personalProjects.songTrackerBackend.auth.JWTUtil jwtUtil;

    @Test
    void createUserReturnsCreatedUser() throws Exception {
        UserDTO dto = new UserDTO(
                "Test User",
                "test123"
        );

        User created = new User(
                dto.username(),
                dto.password()
        );
        created.setId(1L);

        when(userService.createUser(any(User.class))).thenReturn(created);
        when(jwtUtil.generateToken("Test User")).thenReturn("jwt-token-test");  // Mock the token generati

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token-test"));

        verify(userService).createUser(any(User.class));
    }

    @Test
    void createUserWhenUsernameExistsReturnsServerError() throws Exception {
        UserDTO dto = new UserDTO(
                "Test User",
                "test123"
        );

        when(userService.createUser(any(User.class))).thenThrow(new com.personalProjects.songTrackerBackend.exceptions.UsernameAlreadyExistsException("Test User"));

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().is4xxClientError());

        verify(userService).createUser(any(User.class));
    }

    @Test
    void loginReturnsTokenWhenCredentialsValid() throws Exception {
        String username = "testuser";
        String password = "pass123";
        String token = "jwt-token";

        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        when(jwtUtil.generateToken(username)).thenReturn(token);

        String body = objectMapper.writeValueAsString(new UserDTO(username, password));

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token));

        verify(authenticationManager).authenticate(any());
        verify(jwtUtil).generateToken(username);
    }
}