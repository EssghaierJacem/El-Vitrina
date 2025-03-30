package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomOrderRepository extends JpaRepository<CustomOrder, Long> {
    List<CustomOrder> findByUserId(Long userId);

    List<CustomOrder> findByUserIdAndStatus(Long userId, OrderStatusType status);
}
