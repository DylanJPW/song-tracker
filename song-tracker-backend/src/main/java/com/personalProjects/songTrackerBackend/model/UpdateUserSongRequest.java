package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;

import java.time.Instant;

public record UpdateUserSongRequest(
        SongStatus status,
        Integer capo,
        Integer difficultyRating,
        Instant lastPractised
) {}