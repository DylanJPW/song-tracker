package com.personalProjects.songTrackerBackend.model;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void passwordHashIsNeverSerialisedToJson() {
        User user = new User("testuser", "$2a$10$fakeBcryptHashForTheTest");
        user.setId(1L);

        String json = objectMapper.writeValueAsString(user);

        assertTrue(json.contains("\"username\":\"testuser\""));
        assertFalse(json.contains("password"));
        assertFalse(json.contains("$2a$10$fakeBcryptHashForTheTest"));
    }
}
