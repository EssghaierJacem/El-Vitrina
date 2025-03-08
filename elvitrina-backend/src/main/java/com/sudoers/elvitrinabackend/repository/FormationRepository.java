package com.sudoers.elvitrinabackend.repository;


import com.sudoers.elvitrinabackend.model.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
}
