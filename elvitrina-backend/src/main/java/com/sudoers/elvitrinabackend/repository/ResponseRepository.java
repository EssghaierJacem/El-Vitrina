package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
   // List<Response> findByUserIdAndQuestionId(Long userId, Long id);

   // List<Response> findByUserId(Long userId);
}
