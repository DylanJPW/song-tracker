package com.personalProjects.songTrackerBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String album;

    @Column()
    private String imageUrl;

    public Song(String title, String artist, String album, String imageUrl) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
    }
}
