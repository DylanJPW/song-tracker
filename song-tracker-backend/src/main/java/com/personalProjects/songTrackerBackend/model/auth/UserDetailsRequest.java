package com.personalProjects.songTrackerBackend.model.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetailsRequest {
    private String username;
    private String password;
}
