package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.exceptions.UsernameAlreadyExistsException;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.repository.UserRepository;
import com.personalProjects.songTrackerBackend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

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
    void shouldThrowWhenUsernameExists() {
        User user = new User();
        user.setUsername("Test User");

        when(userRepository.existsByUsername("Test User")).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class, () -> userService.createUser(user));
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldEncodePasswordWhenCreatingUser() {
        User user = new User();
        user.setUsername("Test User");
        user.setPassword("plainPassword");

        when(userRepository.existsByUsername("Test User")).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(user);

        assertNotEquals("plainPassword", result.getPassword());
        assertTrue(result.getPassword().startsWith("$2"));
        verify(userRepository).save(any());
    }
}
