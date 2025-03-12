package com.sudoers.elvitrinabackend.service.blogPost;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Formation;

import java.util.List;

public interface IBlogPostService {

    List<BlogPost> retrieveAllBlogPosts();
    BlogPost addBlogPost (BlogPost blogPost);
    BlogPost updateBlogPost (BlogPost blogPost);
    BlogPost retrieveBlogPost(long id);
    void removeBlogPost(long id);
}
