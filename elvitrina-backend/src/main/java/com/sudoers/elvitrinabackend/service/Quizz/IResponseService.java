package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.entity.Response;

import java.util.List;
import java.util.Optional;

public interface IResponseService {

    Response createResponse(Response response);
    Optional<Response> getResponseById(Long id);
    List<Response> getAllResponses();
    Response updateResponse(Long id, Response response);
    void deleteResponse(Long id);
}
