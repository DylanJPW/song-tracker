package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.auth.JWTUtil;
import com.personalProjects.songTrackerBackend.model.CurrentUserResponse;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.model.LoginRequest;
import com.personalProjects.songTrackerBackend.model.RegisterRequest;
import com.personalProjects.songTrackerBackend.model.auth.UserDetailsResponse;
import com.personalProjects.songTrackerBackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping("/currentUser")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.of(userService.getUserByUsername(authentication.getName())
                .map(User::toResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDetailsResponse> createUser(@Valid @RequestBody RegisterRequest request) {
        User newUser = userService.createUser(
                new User(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtUtil.generateToken(newUser.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserDetailsResponse(token, newUser.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDetailsResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtUtil.generateToken(request.username());
        return ResponseEntity.ok(new UserDetailsResponse(token, request.username()));
    }
}