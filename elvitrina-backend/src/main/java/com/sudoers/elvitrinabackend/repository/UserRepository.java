package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByImage(String image);

    @Query("""
        SELECT FUNCTION('MONTH', u.registrationDate) AS month, COUNT(u) 
        FROM User u 
        WHERE u.registrationDate IS NOT NULL
        GROUP BY FUNCTION('MONTH', u.registrationDate)
        ORDER BY month
    """)
    List<Object[]> countNewUsersPerMonth();

    @Query("""
        SELECT u
        FROM User u
        WHERE u.isActive = true
        ORDER BY u.points DESC
    """)
    List<User> findTopUsersByPoints();

    List<User> findTop5ByOrderByRegistrationDateDesc();

}
