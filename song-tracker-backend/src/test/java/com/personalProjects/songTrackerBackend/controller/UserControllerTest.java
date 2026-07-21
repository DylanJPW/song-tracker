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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
    void getAllUsersReturnsAllUsers() throws Exception {
        User user = new User(
                "Test User",
                "test123"
        );
        user.setId(1L);

        when(userService.getAllUsers()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].username").value("Test User"))
                .andExpect(jsonPath("$[0].password").value("test123"));

        verify(userService).getAllUsers();
    }

    @Test
    void getUserExistingUserReturnsUser() throws Exception {
        User user = new User(
                "Test User",
                "test123"
        );
        user.setId(1L);

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("Test User"))
                .andExpect(jsonPath("$.password").value("test123"));

        verify(userService).getUserById(1L);
    }

    @Test
    void getUserNonExistingUserReturnsNotFound() throws Exception {
        when(userService.getUserById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById(1L);
    }

    @Test
    void deleteUserExistingUserReturns200() throws Exception {
        User user = new User(
                "Test User",
                "test123"
        );
        user.setId(1L);

        when(userService.deleteUser(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());

        verify(userService).deleteUser(1L);
    }

    @Test
    void deleteUserNonExistingUserReturnsNotFound() throws Exception {
        when(userService.deleteUser(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNotFound());

        verify(userService).deleteUser(1L);
    }

    @Test
    void createUserReturnsCreatedUser() throws Exception {
        UserDTO dto = new UserDTO(
                "Test User",
                "test123"
        );

        User created = new User(
                dto.getUsername(),
                dto.getPassword()
        );
        created.setId(1L);

        when(userService.createUser(any(User.class))).thenReturn(created);
        when(jwtUtil.generateToken("Test User")).thenReturn("jwt-token-test");  // Mock the token generati

        mockMvc.perform(post("/api/users")
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

        mockMvc.perform(post("/api/users")
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

    @Test
    void updateUserExistingUserReturnsUpdatedUser() throws Exception {
        UserDTO dto = new UserDTO(
                "Updated User",
                "updated123"
        );

        User user = new User(
                dto.getUsername(),
                dto.getPassword()
        );
        user.setId(1L);



        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(Optional.of(user));

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("Updated User"))
                .andExpect(jsonPath("$.password").value("updated123"));

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    void updateUserNonExistingUserReturnsNotFound() throws Exception {
        UserDTO dto = new UserDTO(
                "Updated User",
                "updated123"
        );

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());

        verify(userService).updateUser(eq(1L), any(User.class));
    }
}