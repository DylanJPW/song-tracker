package com.personalProjects.songTrackerBackend.spotify.dto;

import java.util.List;

public record SpotifyTracks(
        List<SpotifyTrack> items
) {}