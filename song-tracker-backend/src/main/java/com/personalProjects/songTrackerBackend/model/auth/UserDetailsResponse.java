package com.personalProjects.songTrackerBackend.model.auth;

import lombok.Getter;

@Getter
public class UserDetailsResponse {
    private String token;
    private String username;

    public UserDetailsResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
}
