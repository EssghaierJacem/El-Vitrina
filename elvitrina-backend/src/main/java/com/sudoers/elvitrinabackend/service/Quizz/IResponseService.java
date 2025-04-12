package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.ResponseDTO;

import java.util.List;
import java.util.Optional;

public interface IResponseService {

    ResponseDTO createResponse(ResponseDTO responseDTO);
    Optional<ResponseDTO> getResponseById(Long id);
    List<ResponseDTO> getAllResponses();
    ResponseDTO updateResponse(Long id, ResponseDTO responseDTO);
    void deleteResponse(Long id);

    ResponseDTO submitResponse(ResponseDTO responseDTO);

    List<ResponseDTO> getResponsesByUserId(Long userId);
}
