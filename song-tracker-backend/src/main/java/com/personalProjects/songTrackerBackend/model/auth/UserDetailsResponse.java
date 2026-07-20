package com.personalProjects.songTrackerBackend.model.auth;

import lombok.Getter;

@Getter
public class UserDetailsResponse {
    private String token;
    public UserDetailsResponse(String token) { this.token = token; }
}
