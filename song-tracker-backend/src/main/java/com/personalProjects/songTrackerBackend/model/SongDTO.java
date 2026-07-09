package com.personalProjects.songTrackerBackend.model;

import java.util.List;

public class SongDTO {

    private String title;
    private String artist;
    private String album;
    private String imageUrl;

    public SongDTO() {
    }

    public SongDTO(String title, String artist, String album, String imageUrl) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
