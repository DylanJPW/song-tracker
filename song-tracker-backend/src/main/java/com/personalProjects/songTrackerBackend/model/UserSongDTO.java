package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;

public record UserSongDTO(
        Long id,
        SongDTO song,
        SongStatus status,
        Integer capo,
        Integer difficultyRating
) {
    public static UserSongDTO from(UserSong userSong) {
        return new UserSongDTO(
                userSong.getId(),
                SongDTO.from(userSong.getSong()),
                userSong.getStatus(),
                userSong.getCapo(),
                userSong.getDifficultyRating()
        );
    }
}