package com.personalProjects.songTrackerBackend.model;

public record CurrentUserResponse (
        Long id,
        String username
) {}