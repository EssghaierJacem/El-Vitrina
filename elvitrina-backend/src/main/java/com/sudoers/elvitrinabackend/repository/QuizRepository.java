package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz,Long> {


}
