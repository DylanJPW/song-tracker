package com.personalProjects.songTrackerBackend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public record SongDTO(
        String title,
        String artist,
        String album,
        String imageUrl
) {}