package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {

}