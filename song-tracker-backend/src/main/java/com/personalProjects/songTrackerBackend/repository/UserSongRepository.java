package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.UserSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {
    public List<UserSong> findAllByUserId(Long userId);
    public Optional<UserSong> findByIdAndUserUsername(Long id, String username);
}