package com.sudoers.elvitrinabackend.controller.comment;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Comment;
import com.sudoers.elvitrinabackend.service.blogPost.IBlogPostService;
import com.sudoers.elvitrinabackend.service.comment.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {
    @Autowired
    ICommentService commentService;

    @GetMapping("/getcomments")
    public List<Comment> getComments(){
        return (List<Comment>) commentService.retrieveAllComments();
    }

    @PostMapping("/addcomment")
    public Comment addComment (@RequestBody Comment comment){
        return commentService.addComment(comment);
    }

    @PutMapping("/updatecomment")
    public Comment updateComment (@RequestBody Comment comment){
        return commentService.updateComment(comment);
    }

    @GetMapping("/getcomment/{id}")
    public Comment getComment (@PathVariable("id") long id){
        return commentService.retrieveComment(id);
    }

    @DeleteMapping("/removecomment/{id}")
    public void removeComment (@PathVariable("id") long id){
        commentService.retrieveComment(id);
    }

}

