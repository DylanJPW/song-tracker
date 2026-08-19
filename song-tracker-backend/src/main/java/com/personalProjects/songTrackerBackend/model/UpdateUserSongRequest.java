package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;

public record UpdateUserSongRequest(
        SongStatus status,
        Integer capo,
        Integer difficultyRating
) {}