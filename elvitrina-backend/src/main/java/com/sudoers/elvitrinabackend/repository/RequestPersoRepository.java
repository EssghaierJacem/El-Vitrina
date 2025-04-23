package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestPersoRepository extends JpaRepository<RequestPerso, Long> {
    List<RequestPerso> findAllByOrderByDateDesc();

    // RequestPersoRepository.java (add these methods)
    @Query("SELECT COUNT(r) FROM RequestPerso r")
    Long countTotalRequests();

    @Query(value = """
    SELECT 
        CASE WHEN r.date IS NULL THEN 'No Date' 
             ELSE CAST(r.date AS DATE) END as date, 
        COUNT(r.id) as count 
    FROM request_perso r 
    GROUP BY 
        CASE WHEN r.date IS NULL THEN 'No Date' 
             ELSE CAST(r.date AS DATE) END
    """, nativeQuery = true)
    List<Object[]> countRequestsByDate();


    @Query("SELECT r.status, COUNT(r) FROM RequestPerso r GROUP BY r.status")
    List<Object[]> countRequestsByStatus();


    @Query("SELECT r.user.id, COUNT(r) FROM RequestPerso r GROUP BY r.user.id ORDER BY COUNT(r) DESC LIMIT :limit")
    List<Object[]> findTopRequesters(@Param("limit") int limit);
    List<RequestPerso> findByStatus(RequestStatus status);

}
