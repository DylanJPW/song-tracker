package com.personalProjects.songTrackerBackend.unit.service;

import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.repository.UserRepository;
import com.personalProjects.songTrackerBackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    // getAllUsers
    @Test
    void shouldReturnAllUsers() {
        List<User> users = List.of(
                new User(),
                new User()
        );

        when(userRepository.findAll()).thenReturn(users);

        List<User> actualUsers = userService.getAllUsers();

        assertEquals(users, actualUsers);
    }

    // getUser
    @Test
    void shouldReturnUserById() {
        User user = new User(
                "Test User",
                "test123"
        );
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        Optional<User> actualUser = userService.getUserById(1L);
        assertTrue(actualUser.isPresent());
        assertEquals(user, actualUser.get());
        verify(userRepository).findById(1L);
    }

    @Test
    void shouldReturnEmptyWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(1L);

        assertTrue(result.isEmpty());
        verify(userRepository).findById(1L);
    }

    // deleteUser
    @Test
    void shouldDeleteUserWhenExists() {
        User user = new User(
                "Test User",
                "test123"
        );

        when(userRepository.existsById(1L)).thenReturn(true);

        boolean result = userService.deleteUser(1L);

        assertTrue(result);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void shouldNotDeleteUserWhenDoesNotExists() {
        when(userRepository.existsById(1L)).thenReturn(false);

        boolean result = userService.deleteUser(1L);

        assertFalse(result);
        verify(userRepository, never()).deleteById(anyLong());
    }

    // createUser
    @Test
    void shouldCreateUserWhenUsernameDoesNotExist() {
        User user = new User();
        user.setUsername("Test User");

        when(userRepository.existsByUsername("Test User")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.createUser(user);

        assertEquals(user, result);
        verify(userRepository).save(user);
    }

    @Test
    void shouldNotCreateUserWhenUsernameExists() {
        User user = new User();
        user.setUsername("Test User");

        when(userRepository.existsByUsername("Test User")).thenReturn(true);

        User result = userService.createUser(user);

        assertNull(result);
        verify(userRepository, never()).save(any());
    }

    // updateUser
    @Test
    void shouldUpdateUserWhenFound() {
        User user = new User();
        user.setId(1L);
        user.setUsername("Updated User");
        user.setPassword("updated123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        Optional<User> result = userService.updateUser(1L, user);

        assertTrue(result.isPresent());
        assertEquals(user, result.get());
        verify(userRepository).save(user);
    }

    @Test
    void shouldReturnEmptyWhenUpdatingUserNotExists() {
        User user = new User();
        user.setId(1L);
        user.setUsername("Updated User");
        user.setPassword("updated123");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser(1L, user);

        assertTrue(result.isEmpty());
        verify(userRepository, never()).save(any());
    }
}
