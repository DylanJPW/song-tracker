package com.personalProjects.songTrackerBackend.controller;

import com.personalProjects.songTrackerBackend.model.Song;
import com.personalProjects.songTrackerBackend.model.SongDTO;
import com.personalProjects.songTrackerBackend.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    @Autowired
    private SongService songService;

    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Song> getSong(@PathVariable int id) {
        return ResponseEntity.of(songService.getSong(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable int id) {
        if (songService.deleteSong(id)) {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping()
    public ResponseEntity<Song> createSong(@RequestBody SongDTO songDTO) {
        Song newSong = songService.createSong(
                new Song(
                        songDTO.getName(),
                        songDTO.getArtist(),
                        songDTO.getLinks(),
                        songDTO.getNotes()
                )
        );

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newSong.getId())
                .toUri();

        return ResponseEntity.created(location).body(newSong);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable int id, @RequestBody SongDTO newSong) {
        return songService.updateSong(id, newSong)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
