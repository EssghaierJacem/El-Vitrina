package com.sudoers.elvitrinabackend.service.requestPerso;

import com.sudoers.elvitrinabackend.model.dto.RequestPersoDTO;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;

import java.util.List;

public interface IRequestPersoService {
    public RequestPerso addRequestPerso (RequestPerso request);
    public List<RequestPerso> getAllRequestPerso();
    public List<RequestPersoDTO> getAllRequestPersoDTO();
    public RequestPersoDTO getRequestPersoByIdd(Long id);
    public RequestPerso getRequestPersoById(Long id);
    public void deleteRequestPersoById(Long id);
    public RequestPerso updateRequestPerso (Long id,RequestPersoDTO request);
}
