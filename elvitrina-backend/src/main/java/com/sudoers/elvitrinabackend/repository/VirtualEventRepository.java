package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VirtualEventRepository extends JpaRepository<VirtualEvent, Long> {

}
