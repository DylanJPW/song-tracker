package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;

public record UserSongDTO(
        SongDTO song,
        SongStatus status,
        Integer capo,
        Integer difficultyRating
) {}