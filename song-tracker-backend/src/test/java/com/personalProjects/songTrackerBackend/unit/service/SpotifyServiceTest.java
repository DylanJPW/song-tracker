package com.personalProjects.songTrackerBackend.unit.service;

import com.personalProjects.songTrackerBackend.client.SpotifyClient;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;
import com.personalProjects.songTrackerBackend.service.SpotifyService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import se.michaelthelin.spotify.model_objects.specification.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpotifyServiceTest {

    @Mock
    private SpotifyClient spotifyClient;

    @InjectMocks
    private SpotifyService spotifyService;


    @Test
    void shouldReturnMappedSongsWhenSearchSucceeds() throws Exception {

        Track track = mock(Track.class);
        ArtistSimplified artist = mock(ArtistSimplified.class);
        AlbumSimplified album = mock(AlbumSimplified.class);
        Image image = mock(Image.class);

        Paging<Track> paging = mock(Paging.class);


        when(spotifyClient.searchTracks("stick season"))
                .thenReturn(paging);

        when(paging.getItems())
                .thenReturn(new Track[]{track});


        when(track.getId())
                .thenReturn("spotify-id");

        when(track.getName())
                .thenReturn("Stick Season");

        when(track.getArtists())
                .thenReturn(new ArtistSimplified[]{artist});

        when(artist.getName())
                .thenReturn("Noah Kahan");

        when(track.getAlbum())
                .thenReturn(album);

        when(album.getName())
                .thenReturn("Stick Season");

        when(album.getImages())
                .thenReturn(new Image[]{image});

        when(image.getUrl())
                .thenReturn("image-url");


        List<SongSearchResult> result =
                spotifyService.searchTracks("stick season");


        assertEquals(1, result.size());

        SongSearchResult song = result.getFirst();

        assertEquals("spotify-id", song.spotifyId());
        assertEquals("Stick Season", song.title());
        assertEquals("Noah Kahan", song.artist());
        assertEquals("Stick Season", song.album());
        assertEquals("image-url", song.imageUrl());


        verify(spotifyClient)
                .searchTracks("stick season");
    }


    @Test
    void shouldReturnEmptyListWhenNoTracksFound() throws Exception {

        Paging<Track> paging = mock(Paging.class);

        when(spotifyClient.searchTracks("unknown"))
                .thenReturn(paging);

        when(paging.getItems())
                .thenReturn(new Track[0]);


        List<SongSearchResult> result =
                spotifyService.searchTracks("unknown");


        assertTrue(result.isEmpty());

        verify(spotifyClient)
                .searchTracks("unknown");
    }


    @Test
    void shouldReturnNullImageWhenTrackHasNoAlbumImages() throws Exception {

        Track track = mock(Track.class);
        ArtistSimplified artist = mock(ArtistSimplified.class);
        AlbumSimplified album = mock(AlbumSimplified.class);

        Paging<Track> paging = mock(Paging.class);


        when(spotifyClient.searchTracks("song"))
                .thenReturn(paging);

        when(paging.getItems())
                .thenReturn(new Track[]{track});


        when(track.getId())
                .thenReturn("spotify-id");

        when(track.getName())
                .thenReturn("Song");

        when(track.getArtists())
                .thenReturn(new ArtistSimplified[]{artist});

        when(artist.getName())
                .thenReturn("Artist");

        when(track.getAlbum())
                .thenReturn(album);

        when(album.getName())
                .thenReturn("Album");

        when(album.getImages())
                .thenReturn(new Image[0]);


        SongSearchResult result =
                spotifyService.searchTracks("song")
                        .getFirst();


        assertNull(result.imageUrl());
    }


    @Test
    void shouldPropagateExceptionFromSpotifyClient() throws Exception {

        when(spotifyClient.searchTracks("error"))
                .thenThrow(new RuntimeException("Spotify error"));


        Exception exception = assertThrows(
                Exception.class,
                () -> spotifyService.searchTracks("error")
        );


        assertEquals(
                "Spotify error",
                exception.getMessage()
        );
    }
}