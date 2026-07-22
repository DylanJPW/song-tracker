package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.auth.JWTUtil;
import com.personalProjects.songTrackerBackend.model.User;
import com.personalProjects.songTrackerBackend.model.UserDTO;
import com.personalProjects.songTrackerBackend.model.auth.UserDetailsResponse;
import com.personalProjects.songTrackerBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.of(userService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/register")
    public ResponseEntity<UserDetailsResponse> createUser(@RequestBody UserDTO userDTO) {
        User newUser = userService.createUser(
                new User(
                        userDTO.getUsername(),
                        userDTO.getPassword()
                )
        );

        String token = jwtUtil.generateToken(newUser.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserDetailsResponse(token));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<UserDetailsResponse> login(@RequestBody UserDTO UserDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        UserDTO.getUsername(),
                        UserDTO.getPassword()
                )
        );

        String token = jwtUtil.generateToken(UserDTO.getUsername());
        return ResponseEntity.ok(new UserDetailsResponse(token));
    }
}