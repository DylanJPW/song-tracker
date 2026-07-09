package com.personalProjects.songTrackerBackend.model;

public record SongSearchResult(
        String id,
        String title,
        String artist,
        String album,
        String imageUrl
) {}