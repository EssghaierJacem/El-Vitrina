package com.sudoers.elvitrinabackend.service.comment;

import com.sudoers.elvitrinabackend.model.entity.Comment;
import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.repository.CommentRepository;
import com.sudoers.elvitrinabackend.service.ActionHistory.ActionHistoryService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService implements ICommentService{
    @Autowired
    CommentRepository commentRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private ActionHistoryService historyService;


    @Override
    public List<Comment> retrieveAllComments() {
        return (List<Comment>) commentRepository.findAll();
    }

    /*
    @Override
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);    }

    @Override
    public Comment updateComment(Comment comment) {
        Comment existingFormation = commentRepository.findById(comment.getId())
                .orElseThrow(() -> new RuntimeException("Formation not found"));


        comment.setUser( existingFormation.getUser() );
        comment.setBlogPost(existingFormation.getBlogPost());
        return commentRepository.save(comment);    }

    @Override
    public void removeComment(long id) {
        commentRepository.deleteById(id);
    }
    */


    @Override
    public Comment addComment(Comment comment) {
        Comment savedComment = commentRepository.save(comment);

        // Historique : Ajout d'un commentaire
        historyService.logAction(
                "Comment",
                savedComment.getId(),
                "CREATE",
                "Ajout d’un commentaire à l’article : " + savedComment.getBlogPost().getTitle(),
                comment.getUser()
        );

        return savedComment;
    }

    @Override
    public Comment updateComment(Comment comment) {
        Comment existingComment = commentRepository.findById(comment.getId())
                .orElseThrow(() -> new RuntimeException("Commentaire introuvable"));

        comment.setUser(existingComment.getUser());
        comment.setBlogPost(existingComment.getBlogPost());

        Comment updated = commentRepository.save(comment);

        // Historique : Modification d’un commentaire
        historyService.logAction(
                "Comment",
                updated.getId(),
                "UPDATE",
                "Modification du commentaire pour l’article : " + updated.getBlogPost().getTitle(),
                comment.getBlogPost().getUser()
        );

        return updated;
    }

    @Override
    public void removeComment(long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commentaire introuvable"));

        commentRepository.deleteById(id);

        // Historique : Suppression d’un commentaire
        historyService.logAction(
                "Comment",
                comment.getId(),
                "DELETE",
                "Suppression du commentaire de l’article : " + comment.getBlogPost().getTitle(),
                comment.getBlogPost().getUser()
        );
    }


    @Override
    public Comment retrieveComment(long id) {
        return commentRepository.findById(id).orElse(null);
    }


    @Override
    public List<Comment> getCommentsByBlogPost(Long blogPostId) {
        return commentRepository.findByBlogPostId(blogPostId);
    }
}
