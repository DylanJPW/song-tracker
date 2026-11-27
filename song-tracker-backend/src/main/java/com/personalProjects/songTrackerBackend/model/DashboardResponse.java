package com.personalProjects.songTrackerBackend.model;

public record DashboardResponse(
        UserSongDTO mostRecentlyPractised,
        UserSongDTO oldestPractised,
        UserSongDTO newlyAdded,
        long practisedInLast30Days,
        MonthlyPractice practisedThisMonth,
        long songCount
) {}