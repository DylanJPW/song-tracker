package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.UserSong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {
}