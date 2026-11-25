package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.UserSong;
import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
        SELECT COUNT(us) FROM UserSong us
        WHERE us.user.username = :username
          AND us.lastPractised >= :start
          AND us.lastPractised < :end
        """)
    long countPractisedBetween(@Param("username") String username,
                               @Param("start") Instant start,
                               @Param("end") Instant end);
}