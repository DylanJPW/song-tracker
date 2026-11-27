package com.personalProjects.songTrackerBackend.model;

import java.util.List;

public record DashboardResponse(
        List<UserSongDTO> wantToLearn,
        List<UserSongDTO> learning,
        List<UserSongDTO> learned,
        UserSongDTO mostRecentlyPractised,
        UserSongDTO oldestPractised,
        UserSongDTO newlyAdded,
        long practisedInLast30Days,
        MonthlyPractice practisedThisMonth,
        long songCount
) {}