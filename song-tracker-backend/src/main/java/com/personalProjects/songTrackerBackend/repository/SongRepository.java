package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SongRepository extends JpaRepository<Song, Long> {
    public Optional<Song> findBySpotifyId(String id);
}