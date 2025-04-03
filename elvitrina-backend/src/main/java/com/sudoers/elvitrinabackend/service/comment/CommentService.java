package com.sudoers.elvitrinabackend.service.comment;

import com.sudoers.elvitrinabackend.model.entity.Comment;
import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService implements ICommentService{
    @Autowired
    CommentRepository commentRepository;
    @Override
    public List<Comment> retrieveAllComments() {
        return (List<Comment>) commentRepository.findAll();
    }

    @Override
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);    }

    @Override
    public Comment updateComment(Comment comment) {
        return commentRepository.save(comment);    }

    @Override
    public Comment retrieveComment(long id) {
        return commentRepository.findById(id).orElse(null);
    }

    @Override
    public void removeComment(long id) {
        commentRepository.deleteById(id);
    }
}
