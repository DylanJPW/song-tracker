package com.personalProjects.songTrackerBackend.spotify.dto;

import java.util.List;

public record SpotifyTrack(

        String id,

        String name,

        List<SpotifyArtist> artists,

        SpotifyAlbum album

) {
    private SongSearchResult toSongSearchResult(SpotifyTrack track) {

        return new SongSearchResult(
                track.id(),
                track.name(),
                track.artists().getFirst().name(),
                track.album().name(),
                track.album().images().isEmpty()
                        ? null
                        : track.album().images().getFirst().url()
        );
    }
}