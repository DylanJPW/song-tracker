package com.personalProjects.songTrackerBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

/**
 * Provides the application's source of "now". Services ask this Clock for the
 * current time instead of calling Instant.now() directly, so tests can swap in
 * Clock.fixed(...) and check time-dependent logic deterministically.
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}
