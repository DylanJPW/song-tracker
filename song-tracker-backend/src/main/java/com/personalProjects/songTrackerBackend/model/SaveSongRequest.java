package com.personalProjects.songTrackerBackend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SaveSongRequest(
        @NotBlank(message = "Spotify ID is required")
        @Pattern(regexp = "^[A-Za-z0-9]{22}$", message = "Must be a valid Spotify track ID")
        String spotifyId
) {}