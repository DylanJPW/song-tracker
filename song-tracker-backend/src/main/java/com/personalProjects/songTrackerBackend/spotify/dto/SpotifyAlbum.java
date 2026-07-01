package com.personalProjects.songTrackerBackend.spotify.dto;

import java.util.List;

public record SpotifyAlbum(

        String name,

        List<SpotifyImage> images

) {}