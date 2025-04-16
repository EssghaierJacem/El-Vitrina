package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.sudoers.elvitrinabackend.model.enums.ReactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties("blogPosts" )
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean status;

    private String image;

    private String tag;

    private int reactionNumber;

    @Enumerated(EnumType.STRING)
    private ReactionType reaction;

    @OneToMany(mappedBy = "blogPost")
    @JsonIgnoreProperties("blogPost" )
    private List<Comment> comments;
}
