package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.ResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Question;
import com.sudoers.elvitrinabackend.model.entity.Response;
import com.sudoers.elvitrinabackend.repository.QuestionRepository;
import com.sudoers.elvitrinabackend.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResponseService implements IResponseService {

    private final ResponseRepository responseRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository, QuestionRepository questionRepository) {
        this.responseRepository = responseRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public ResponseDTO createResponse(ResponseDTO responseDTO) {
        Response response = new Response();
        response.setResponse(responseDTO.getResponse());
        response.setQuestion(questionRepository.findById(responseDTO.getQuestionId()).orElse(null));

        response = responseRepository.save(response);
        responseDTO.setId(response.getId());
        return responseDTO;
    }

    @Override
    public Optional<ResponseDTO> getResponseById(Long id) {
        return responseRepository.findById(id).map(response -> new ResponseDTO(
                response.getId(),
                response.getResponse(),
                response.getQuestion() != null ? response.getQuestion().getId() : null
        ));
    }

    @Override
    public List<ResponseDTO> getAllResponses() {
        return responseRepository.findAll().stream().map(response -> new ResponseDTO(
                response.getId(),
                response.getResponse(),
                response.getQuestion() != null ? response.getQuestion().getId() : null
        )).collect(Collectors.toList());
    }

    @Override
    public ResponseDTO updateResponse(Long id, ResponseDTO responseDTO) {
        if (!responseRepository.existsById(id)) {
            return null;
        }

        Response response = new Response();
        response.setId(id);
        response.setResponse(responseDTO.getResponse());

        if (responseDTO.getQuestionId() != null) {
            response.setQuestion(
                    questionRepository.findById(responseDTO.getQuestionId()).orElse(null)
            );
        } else {
            response.setQuestion(null); 
        }

        response = responseRepository.save(response);

        // Tu peux aussi renvoyer la nouvelle version à jour :
        return new ResponseDTO(
                response.getId(),
                response.getResponse(),
                response.getQuestion() != null ? response.getQuestion().getId() : null
        );
    }


    @Override
    public void deleteResponse(Long id) {
        responseRepository.deleteById(id);
    }

    @Override
    public ResponseDTO submitResponse(ResponseDTO responseDTO) {
        return createResponse(responseDTO);
    }

    @Override
    public List<ResponseDTO> getResponsesByUserId(Long userId) {
        return List.of(); // Placeholder: needs implementation if user linkage exists
    }
}