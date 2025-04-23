package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.ActionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ActionHistoryRepository extends JpaRepository<ActionHistory, Long> {
    List<ActionHistory> findAllByOrderByTimestampDesc();
}


