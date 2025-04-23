package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);

}
