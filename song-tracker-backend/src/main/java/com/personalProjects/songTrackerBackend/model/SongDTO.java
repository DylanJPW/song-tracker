package com.personalProjects.songTrackerBackend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public record SongDTO(
        Long id,
        String spotifyId,
        String title,
        String artist,
        String album,
        String imageUrl
) {
    public static SongDTO from(Song song) {
        return new SongDTO(
                song.getId(),
                song.getSpotifyId(),
                song.getTitle(),
                song.getArtist(),
                song.getAlbum(),
                song.getImageUrl()
        );
    }
}