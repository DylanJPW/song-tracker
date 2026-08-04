package com.personalProjects.songTrackerBackend.service;

import com.personalProjects.songTrackerBackend.client.SpotifyClient;
import com.personalProjects.songTrackerBackend.model.SongSearchResult;

import org.apache.hc.core5.http.ParseException;
import org.springframework.stereotype.Service;

import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.data.tracks.GetTrackRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletionException;

@Service
public class SpotifyService {

    private final SpotifyClient spotifyClient;


    public SpotifyService(SpotifyClient spotifyClient) {
        this.spotifyClient = spotifyClient;
    }


    public List<SongSearchResult> searchTracks(String query)
            throws Exception {

        Paging<Track> paging =
                spotifyClient.searchTracks(query);


        return Arrays.stream(paging.getItems())
                .map(this::mapTrack)
                .toList();
    }

    public SongSearchResult getTrack(String id)
            throws Exception {
        final SpotifyApi spotifyApi  = spotifyClient.getSpotifyApi();
        final GetTrackRequest getTrackRequest = spotifyApi.getTrack(id).build();

        Track track = getTrackRequest.execute();
        return mapTrack(track);
    }


    private SongSearchResult mapTrack(Track track) {

        return new SongSearchResult(
                track.getId(),
                track.getName(),
                track.getArtists()[0].getName(),
                track.getAlbum().getName(),
                track.getAlbum().getImages().length > 0
                        ? track.getAlbum().getImages()[0].getUrl()
                        : null
        );
    }

}