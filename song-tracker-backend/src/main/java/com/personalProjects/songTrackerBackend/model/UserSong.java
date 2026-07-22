package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
class UserSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Song song;

    @Column(nullable = false)
    private SongStatus status;

    @Column
    private String notes;

    @Column
    private Integer capo;

    @Column
    private Integer difficultyRating;

    public UserSong(User user, Song song, SongStatus status) {
        this.user = user;
        this.song = song;
        this.status = status;
    }
}