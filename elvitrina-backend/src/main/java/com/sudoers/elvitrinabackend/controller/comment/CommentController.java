package com.sudoers.elvitrinabackend.controller.comment;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Comment;
import com.sudoers.elvitrinabackend.service.blogPost.IBlogPostService;
import com.sudoers.elvitrinabackend.service.comment.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
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

    @PutMapping("/{id}/updatecomment")
    public Comment updateComment (@PathVariable("id") Long id, @RequestBody Comment comment){
        comment.setId(id);
        return commentService.updateComment(comment);
    }

    @GetMapping("/{id}")
    public Comment getComment (@PathVariable("id") long id){
        return commentService.retrieveComment(id);
    }

    @DeleteMapping("/{id}/removecomment")
    public void removeComment (@PathVariable("id") long id){
        commentService.removeComment(id);
    }


    @GetMapping("/blog-post/{blogPostId}")
    public List<Comment> getCommentsByBlogPost(@PathVariable Long blogPostId) {
        return commentService.getCommentsByBlogPost(blogPostId);
    }
}

