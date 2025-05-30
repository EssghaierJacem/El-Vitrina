package com.sudoers.elvitrinabackend.controller.blogPost;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.BlogPostRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.blogPost.BlogPostService;
import com.sudoers.elvitrinabackend.service.blogPost.IBlogPostService;
import com.sudoers.elvitrinabackend.service.formation.IFormationService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/blogposts")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class BlogPostController {
    @Autowired
    IBlogPostService blogPostService;

    @Autowired
    BlogPostRepository blogPostRepository;

    @Autowired
    UserService userService;

    @GetMapping("/getblogposts")
    public List<BlogPost> getBlogPosts(){
        return (List<BlogPost>) blogPostService.retrieveAllBlogPosts();
    }

    /*
    @PostMapping("/addblogpost")
    public BlogPost addBlogPost (@RequestBody BlogPost blogPost){
        return blogPostService.addBlogPost(blogPost);
    }
     */
    @PostMapping("/addblogpost")
    public ResponseEntity<BlogPost> addBlogPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("tag") String tag,
    @RequestParam("userId") Long userId) {

        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(title);
        blogPost.setContent(content);
        blogPost.setTag(tag);

        User user = userService.findById(userId);

        blogPost.setUser(user);
        BlogPost savedPost = blogPostService.addBlogPost(blogPost, image);
        System.out.println(savedPost.getId());
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{id}/updateblogpost")
    public BlogPost updateBlogPost (@PathVariable("id") Long id, @RequestBody BlogPost blogPost){
        blogPost.setId(id);
        return blogPostService.updateBlogPost(blogPost);
    }

    @GetMapping("/{id}")
    public BlogPost getBlogPost (@PathVariable("id") long id){
        return blogPostService.retrieveBlogPost(id);
    }

    @DeleteMapping("/{id}/removeblogpost")
    public void removeBlogPost (@PathVariable("id") long id){
        blogPostService.removeBlogPost(id);
    }


    @PatchMapping("/{id}/like")
    public ResponseEntity<BlogPost> incrementLike(@PathVariable Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setReactionNumber(post.getReactionNumber() + 1);
        BlogPost updated = blogPostRepository.save(post);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/unlike")
    public ResponseEntity<BlogPost> decrementLike(@PathVariable Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setReactionNumber(Math.max(0, post.getReactionNumber() - 1));
        BlogPost updated = blogPostRepository.save(post);
        return ResponseEntity.ok(updated);
    }



}
