package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalPersoRepository extends JpaRepository<ProposalPerso, Long> {
    List<ProposalPerso> findProposalPersoByRequestPersoId(Long requestPersoId);
    List<ProposalPerso> findAllByOrderByDateDesc();
    // ProposalPersoRepository.java (add these methods)
    @Query("SELECT COUNT(p) FROM ProposalPerso p")
    Long countTotalProposals();

    @Query(value = """
    SELECT 
        CASE WHEN p.date IS NULL THEN 'No Date' 
             ELSE CAST(p.date AS DATE) END as date, 
        COUNT(p.id) as count 
    FROM proposal_perso p 
    GROUP BY 
        CASE WHEN p.date IS NULL THEN 'No Date' 
             ELSE CAST(p.date AS DATE) END
    """, nativeQuery = true)
    List<Object[]> countProposalsByDate();

   /* @Query("SELECT DATE(p.date), COUNT(p) FROM ProposalPerso p GROUP BY DATE(p.date)")
    List<Object[]> countProposalsByDate();
*/
    @Query("SELECT p.user.id, COUNT(p) FROM ProposalPerso p GROUP BY p.user.id ORDER BY COUNT(p) DESC LIMIT :limit")
    List<Object[]> findTopProposers(@Param("limit") int limit);


}
