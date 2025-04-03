package com.sudoers.elvitrinabackend.service.comment;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Comment;

import java.util.List;

public interface ICommentService {
    List<Comment> retrieveAllComments();
    Comment addComment (Comment comment);
    Comment updateComment(Comment comment);
    Comment retrieveComment (long id);
    void removeComment(long id);
}
