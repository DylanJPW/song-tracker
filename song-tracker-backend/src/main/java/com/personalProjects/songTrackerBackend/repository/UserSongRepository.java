package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.UserSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {
    public List<UserSong> findAllByUserId(Long userId);
}