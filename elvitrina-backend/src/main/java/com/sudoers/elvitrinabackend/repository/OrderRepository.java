package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<CustomOrder, Long> {
}
