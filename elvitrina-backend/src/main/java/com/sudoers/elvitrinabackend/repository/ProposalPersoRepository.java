package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProposalPersoRepository extends JpaRepository<ProposalPerso, Long> {
}
