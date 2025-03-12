package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomOrderRepository extends JpaRepository<CustomOrder, Long> { }
