package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class UserSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Song song;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SongStatus status;

    @Column
    private String notes;

    @Column
    private Integer capo;

    @Column
    private Integer difficultyRating;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant dateAdded;

    public UserSong(User user, Song song, SongStatus status) {
        this.user = user;
        this.song = song;
        this.status = status;
    }

    public UserSongDTO toDTO() {
        return new UserSongDTO(this.id, this.song.toDTO(), this.status, this.capo, this.difficultyRating, this.dateAdded);
    }
}