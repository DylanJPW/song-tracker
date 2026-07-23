package com.personalProjects.songTrackerBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String spotifyId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String album;

    @Column
    private String imageUrl;

    @OneToMany(mappedBy = "song")
    List<UserSong> userSongs;

    public Song(String title, String artist, String album, String imageUrl) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
    }

    public Song(String spotifyId, String title, String artist, String album, String imageUrl) {
        this.spotifyId = spotifyId;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
    }

    public SongDTO toDTO() {
        return new SongDTO(
                this.title,
                this.artist,
                this.album,
                this.imageUrl
        );
    }
}