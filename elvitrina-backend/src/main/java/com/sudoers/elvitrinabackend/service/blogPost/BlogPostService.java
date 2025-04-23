package com.sudoers.elvitrinabackend.service.blogPost;

import com.sudoers.elvitrinabackend.model.entity.*;
import com.sudoers.elvitrinabackend.repository.BlogPostRepository;
import com.sudoers.elvitrinabackend.service.ActionHistory.ActionHistoryService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import com.sudoers.elvitrinabackend.service.ImageEya.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class BlogPostService implements IBlogPostService{
    @Autowired
    BlogPostRepository blogPostRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;
    @Autowired
    private ActionHistoryService historyService;


    @Override
    public List<BlogPost> retrieveAllBlogPosts() {
        return (List<BlogPost>) blogPostRepository.findAll();
    }

    /*
    @Override
    public BlogPost addBlogPost(BlogPost blogPost) {

        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());

        return blogPostRepository.save(blogPost);
    }

    @Override
    public BlogPost updateBlogPost(BlogPost blogPost) {
        BlogPost existingPost = blogPostRepository.findById(blogPost.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        blogPost.setCreatedAt(existingPost.getCreatedAt());
        blogPost.setUpdatedAt(LocalDateTime.now());
        blogPost.setUser(existingPost.getUser());
        return blogPostRepository.save(blogPost);
    }

    @Override
    public void removeBlogPost(long id) {
        blogPostRepository.deleteById(id);
    }
     */

    @Override
    public BlogPost retrieveBlogPost(long id) {
        return blogPostRepository.findById(id).orElse(null);
    }


    /*
    @Override
    public BlogPost addBlogPost(BlogPost blogPost) {
        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());

        BlogPost savedPost = blogPostRepository.save(blogPost);

        // Historique : Ajout d’un post
        historyService.logAction(
                "BlogPost",
                savedPost.getId(),
                "CREATE",
                "Ajout d’un article : " + savedPost.getTitle(),
                blogPost.getUser()
        );
        return savedPost;
    }
     */


    public BlogPost addBlogPost(BlogPost blogPost, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            try {
                String imagePath = imageService.saveImage(image);
                blogPost.setImage(imagePath);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'upload de l'image", e);
            }
        }

        blogPost.setCreatedAt(LocalDateTime.now());
        blogPost.setUpdatedAt(LocalDateTime.now());

        BlogPost savedPost = blogPostRepository.save(blogPost);

        // Historique : Ajout d’un post
        historyService.logAction(
                "BlogPost",
                savedPost.getId(),
                "CREATE",
                "Ajout d’un article : " + savedPost.getTitle(),
                blogPost.getUser()
        );
        // Enregistrer le BlogPost dans la base de données
        return blogPostRepository.save(blogPost);
    }

    @Override
    public BlogPost updateBlogPost(BlogPost blogPost) {
        BlogPost existingPost = blogPostRepository.findById(blogPost.getId())
                .orElseThrow(() -> new RuntimeException("Post introuvable"));

        blogPost.setCreatedAt(existingPost.getCreatedAt());
        blogPost.setUpdatedAt(LocalDateTime.now());
        blogPost.setUser(existingPost.getUser());

        BlogPost updated = blogPostRepository.save(blogPost);

        // Historique : Modification d’un post
        historyService.logAction(
                "BlogPost",
                updated.getId(),
                "UPDATE",
                "Modification de l’article : " + updated.getTitle(),
                blogPost.getUser()
        );

        return updated;
    }

    @Override
    public void removeBlogPost(long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post introuvable"));

        blogPostRepository.deleteById(id);

        // Historique : Suppression d’un post
        historyService.logAction(
                "BlogPost",
                post.getId(),
                "DELETE",
                "Suppression de l’article : " + post.getTitle(),
                post.getUser()
        );
    }


    public List<UserPostStats> getPostsStatsByUser() {
        List<Object[]> stats = blogPostRepository.countPostsByUser();
        List<UserPostStats> result = new ArrayList<>();

        for (Object[] stat : stats) {
            User user = (User) stat[0];
            Long postCount = (Long) stat[1];
            result.add(new UserPostStats(user, postCount));
        }

        return result;
    }

    public List<DatePostStats> getPostsStatsByDate() {
        List<Object[]> stats = blogPostRepository.countPostsByDate();
        List<DatePostStats> result = new ArrayList<>();

        for (Object[] stat : stats) {
            java.sql.Date sqlDate = (java.sql.Date) stat[0];
            LocalDate date = sqlDate.toLocalDate(); // ✅ conversion propre
            Long count = (Long) stat[1];

            result.add(new DatePostStats(date, count));
        }

        return result;
    }




}
