package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

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
                    song.setTitle(songDTO.getTitle());
                    song.setArtist(songDTO.getArtist());
                    song.setAlbum(songDTO.getAlbum());
                    song.setImageUrl(songDTO.getImageUrl());

                    return songRepository.save(song);
                });
    }
}