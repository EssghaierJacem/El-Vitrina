package com.sudoers.elvitrinabackend.service.blogPost;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Comment;
import com.sudoers.elvitrinabackend.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogPostService implements IBlogPostService{
    @Autowired
    BlogPostRepository blogPostRepository;
    @Override
    public List<BlogPost> retrieveAllBlogPosts() {
        return (List<BlogPost>) blogPostRepository.findAll();
    }

    @Override
    public BlogPost addBlogPost(BlogPost blogPost) {
        return blogPostRepository.save(blogPost);
    }

    @Override
    public BlogPost updateBlogPost(BlogPost blogPost) {
        return blogPostRepository.save(blogPost);
    }

    @Override
    public BlogPost retrieveBlogPost(long id) {
        return blogPostRepository.findById(id).orElse(null);
    }

    @Override
    public void removeBlogPost(long id) {
        blogPostRepository.deleteById(id);
    }
}
