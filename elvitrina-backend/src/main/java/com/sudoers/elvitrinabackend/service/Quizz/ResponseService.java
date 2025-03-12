package com.sudoers.elvitrinabackend.service.Quizz;
import com.sudoers.elvitrinabackend.model.entity.Response;
import com.sudoers.elvitrinabackend.repository.ResponseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ResponseService implements IResponseService  {

    private final ResponseRepository responseRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository) {
        this.responseRepository = responseRepository;
    }

    @Override
    public Response createResponse(Response response) {
        return responseRepository.save(response);
    }

    @Override
    public Optional<Response> getResponseById(Long id) {
        return responseRepository.findById(id);
    }

    @Override
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    @Override
    public Response updateResponse(Long id, Response response) {
        if (!responseRepository.existsById(id)) {
            return null; // Or throw an exception like ResourceNotFoundException
        }
        response.setId(id);
        return responseRepository.save(response);
    }

    @Override
    public void deleteResponse(Long id) {
        responseRepository.deleteById(id);
    }
}
