package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.dto.CustomOrderDTO;

import java.util.List;
import java.util.Optional;

public interface ICustomOrderService {
    List<CustomOrderDTO> findAll();
    Optional<CustomOrderDTO> findById(Long id);
    CustomOrderDTO saveCustomOrder(CustomOrderDTO customOrderDTO);
    CustomOrderDTO update(Long id, CustomOrderDTO customOrderDTO);
    void delete(Long id);
}
