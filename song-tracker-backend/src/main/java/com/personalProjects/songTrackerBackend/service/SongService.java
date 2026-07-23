package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

    @Autowired
    private SpotifyService spotifyService;

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Optional<Song> getSong(Long id) { return songRepository.findById(id); }

    public boolean deleteSong(Long id) {
        if (!songRepository.existsById(id)) return false;
        songRepository.deleteById(id);
        return true;
    }

    public Song createSong(Song song) {
        if (songRepository.existsById(song.getId())) return null;
        return songRepository.save(song);
    }

    public Optional<Song> updateSong(Long id, SongDTO songDTO) {
        return songRepository.findById(id)
                .map(song -> {
                    song.setTitle(songDTO.title());
                    song.setArtist(songDTO.artist());
                    song.setAlbum(songDTO.album());
                    song.setImageUrl(songDTO.imageUrl());

                    return songRepository.save(song);
                });
    }

    public Optional<Song> getSongBySpotifyId(String id) { return songRepository.findBySpotifyId(id); }

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
                            track.id(),
                            track.title(),
                            track.artist(),
                            track.album(),
                            track.imageUrl()
                    );

                    return songRepository.save(song);
                });
    }
}