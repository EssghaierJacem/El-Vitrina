package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestPersoRepository extends JpaRepository<RequestPerso, Long> {
    List<RequestPerso> findAllByOrderByDateDesc();
}
