package com.personalProjects.songTrackerBackend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


public record UserDTO (
        String username,
        String password
) {}