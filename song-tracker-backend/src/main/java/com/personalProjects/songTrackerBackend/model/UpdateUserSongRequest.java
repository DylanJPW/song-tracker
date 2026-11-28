package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.Instant;

public record UpdateUserSongRequest(
        SongStatus status,

        @Min(value = 0, message = "Capo must be between 0 and 12")
        @Max(value = 12, message = "Capo must be between 0 and 12")
        Integer capo,

        @Min(value = 1, message = "Difficulty rating must be between 1 and 5")
        @Max(value = 5, message = "Difficulty rating must be between 1 and 5")
        Integer difficultyRating,

        Instant lastPractised
) {}