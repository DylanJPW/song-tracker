package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.exceptions.UsernameAlreadyExistsException;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        if (!userRepository.existsByUsername(username)) {
            throw new UsernameNotFoundException("User not found");
        }

        Optional<User> user = userRepository.findByUsername(username);

        return org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password(user.get().getPassword())
                .build();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException(user.getUsername());
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}