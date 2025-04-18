package com.sudoers.elvitrinabackend.controller.Stats;

import com.sudoers.elvitrinabackend.model.entity.DatePostStats;
import com.sudoers.elvitrinabackend.model.entity.UserPostStats;
import com.sudoers.elvitrinabackend.service.blogPost.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

public class StatsController {

        @Autowired
        private BlogPostService blogPostService;

        @GetMapping("/posts-by-user")
        public List<UserPostStats> getPostsStatsByUser() {
            return blogPostService.getPostsStatsByUser();
        }


    @GetMapping("/posts-by-date")
    public List<DatePostStats> getPostsStatsByDate() {
        return blogPostService.getPostsStatsByDate();
    }



}


