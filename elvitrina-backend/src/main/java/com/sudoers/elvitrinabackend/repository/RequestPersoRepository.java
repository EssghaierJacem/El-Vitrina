package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestPersoRepository extends JpaRepository<RequestPerso, Long> {
}
