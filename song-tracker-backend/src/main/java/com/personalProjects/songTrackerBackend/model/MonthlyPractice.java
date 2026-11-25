package com.personalProjects.songTrackerBackend.model;

import java.time.YearMonth;

public record MonthlyPractice(YearMonth yearMonth, long count) {
}