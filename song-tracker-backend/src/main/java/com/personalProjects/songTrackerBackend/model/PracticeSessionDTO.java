package com.personalProjects.songTrackerBackend.model;

import java.time.Instant;

public record PracticeSessionDTO(
        UserSong userSong,
        Instant practisedAt
) {
    public static PracticeSessionDTO from(PracticeSession practiceSession) {
        return new PracticeSessionDTO(
                practiceSession.getUserSong(),
                practiceSession.getPractisedAt()
        );
    }
}