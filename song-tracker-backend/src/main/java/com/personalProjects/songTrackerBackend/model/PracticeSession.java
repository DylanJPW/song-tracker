package com.personalProjects.songTrackerBackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PracticeSession {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private UserSong userSong;

    @Column(nullable = false)
    private Instant practisedAt;

    public PracticeSession(UserSong userSong, Instant practisedAt) {
        this.userSong = userSong;
        this.practisedAt = practisedAt;
    }

}