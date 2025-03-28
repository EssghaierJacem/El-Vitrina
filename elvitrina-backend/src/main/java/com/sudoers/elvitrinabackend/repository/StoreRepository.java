package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long>  {
}
