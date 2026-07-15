package com.personalProjects.songTrackerBackend.repository;

import com.personalProjects.songTrackerBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    public boolean existsByUsername(String username);
}
