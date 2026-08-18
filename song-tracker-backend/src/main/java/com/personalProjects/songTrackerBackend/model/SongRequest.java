package com.personalProjects.songTrackerBackend.model;

public record SongRequest(
        String title,
        String artist,
        String album,
        String imageUrl
) {}