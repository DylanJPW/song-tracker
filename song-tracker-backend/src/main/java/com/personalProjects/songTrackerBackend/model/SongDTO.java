package com.personalProjects.songTrackerBackend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SongDTO {

    private String title;
    private String artist;
    private String album;
    private String imageUrl;

    public SongDTO(String title, String artist, String album, String imageUrl) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
    }
}
