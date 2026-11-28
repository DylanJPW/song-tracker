package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

    @Autowired
    private SpotifyService spotifyService;

    public Song getOrCreateFromSpotify(String spotifyId) {

        return songRepository.findBySpotifyId(spotifyId)
                .orElseGet(() -> {

                    SongSearchResult track = null;
                    try {
                        track = spotifyService.getTrack(spotifyId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                    Song song = new Song(
                            track.spotifyId(),
                            track.title(),
                            track.artist(),
                            track.album(),
                            track.imageUrl()
                    );

                    return songRepository.save(song);
                });
    }
}