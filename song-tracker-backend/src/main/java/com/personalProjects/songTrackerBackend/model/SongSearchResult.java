package com.personalProjects.songTrackerBackend.model;

public record SongSearchResult(
        String spotifyId,
        String title,
        String artist,
        String album,
        String imageUrl
) {}