package com.personalProjects.songTrackerBackend.model;

import java.util.List;

public class SongDTO {

    private String name;
    private String artist;
    private List<String> links;
    private String notes;

    public SongDTO() {
    }

    public SongDTO(String name, String artist, List<String> links, String notes) {
        this.name = name;
        this.artist = artist;
        this.links = links;
        this.notes = notes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public List<String> getLinks() {
        return links;
    }

    public void setLinks(List<String> links) {
        this.links = links;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
