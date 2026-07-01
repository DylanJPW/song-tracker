package com.personalProjects.songTrackerBackend.spotify.dto;

public record SongSearchResult(

        String spotifyId,

        String title,

        String artist,

        String album,

        String imageUrl

) {}