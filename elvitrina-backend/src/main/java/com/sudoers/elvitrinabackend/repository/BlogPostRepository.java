package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BlogPostRepository  extends JpaRepository<BlogPost, Long> {

    @Query("SELECT b.user, COUNT(b) FROM BlogPost b GROUP BY b.user")
    List<Object[]> countPostsByUser();

    @Query("SELECT DATE(bp.createdAt), COUNT(bp) FROM BlogPost bp GROUP BY DATE(bp.createdAt)")
    List<Object[]> countPostsByDate();




}
