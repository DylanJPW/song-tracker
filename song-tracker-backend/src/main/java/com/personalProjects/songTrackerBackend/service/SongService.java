package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }
}
