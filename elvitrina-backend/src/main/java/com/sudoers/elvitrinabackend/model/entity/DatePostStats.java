package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


public class DatePostStats {

    private LocalDate date;

    private Long postCount;

    public DatePostStats(LocalDate date, Long postCount) {
        this.date = date;
        this.postCount = postCount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getPostCount() {
        return postCount;
    }

    public void setPostCount(Long postCount) {
        this.postCount = postCount;
    }
}
