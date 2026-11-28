package com.personalProjects.songTrackerBackend.model;

import com.personalProjects.songTrackerBackend.model.enums.SongStatus;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class SongRequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    // SaveSongRequest
    @Test
    void acceptsARealSpotifyTrackId() {
        assertTrue(validator.validate(new SaveSongRequest("4iV5W9uYEdYUVa79Axb7Rh")).isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "too-short", "4iV5W9uYEdYUVa79Axb7Rh-extra", "4iV5W9uYEdYUVa79Axb7R!"})
    void rejectsAnythingThatIsNotASpotifyTrackId(String spotifyId) {
        assertFalse(validator.validate(new SaveSongRequest(spotifyId)).isEmpty());
    }

    // UpdateUserSongRequest
    @Test
    void acceptsAnEmptyPatch() {
        assertTrue(validator.validate(new UpdateUserSongRequest(null, null, null, null)).isEmpty());
    }

    @Test
    void acceptsValuesAtTheLimits() {
        assertTrue(validator.validate(new UpdateUserSongRequest(SongStatus.LEARNING, 0, 1, null)).isEmpty());
        assertTrue(validator.validate(new UpdateUserSongRequest(SongStatus.LEARNING, 12, 5, null)).isEmpty());
    }

    @ParameterizedTest
    @ValueSource(ints = {-1, 13})
    void rejectsCapoOutsideTheFretboard(int capo) {
        Set<ConstraintViolation<UpdateUserSongRequest>> violations =
                validator.validate(new UpdateUserSongRequest(null, capo, null, null));

        assertEquals(1, violations.size());
        assertEquals("capo", violations.iterator().next().getPropertyPath().toString());
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 6})
    void rejectsDifficultyOutsideOneToFive(int difficulty) {
        Set<ConstraintViolation<UpdateUserSongRequest>> violations =
                validator.validate(new UpdateUserSongRequest(null, null, difficulty, null));

        assertEquals(1, violations.size());
        assertEquals("difficultyRating", violations.iterator().next().getPropertyPath().toString());
    }
}