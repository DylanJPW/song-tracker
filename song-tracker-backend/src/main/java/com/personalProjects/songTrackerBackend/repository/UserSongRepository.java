package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.UserSong;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserSongRepository extends JpaRepository<UserSong, Long> {
    public List<UserSong> findAllByUserId(Long userId);
    public Optional<UserSong> findByIdAndUserUsername(Long id, String username);
    public List<UserSong> findAllByUserIdAndStatus(Long userId, SongStatus status);
    public Optional<UserSong> findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedDesc(String username);
    public Optional<UserSong> findFirstByUserUsernameAndLastPractisedIsNotNullOrderByLastPractisedAsc(String username);
    public Optional<UserSong> findFirstByUserUsernameAndStatusOrderByDateAddedDesc(String username, SongStatus status);
    public long countByUserUsernameAndLastPractisedAfter(String username, Instant since);
}