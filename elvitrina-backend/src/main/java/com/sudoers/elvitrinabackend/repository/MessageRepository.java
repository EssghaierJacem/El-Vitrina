package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :user1 AND m.receiver.id = :user2) OR " +
            "(m.sender.id = :user2 AND m.receiver.id = :user1) " +
            "ORDER BY m.sentAt ASC")
    List<Message> findConversationBetweenUsers(@Param("user1") Long user1Id,
                                               @Param("user2") Long user2Id);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :user1 AND m.receiver.id = :user2) OR " +
            "(m.sender.id = :user2 AND m.receiver.id = :user1) " +
            "ORDER BY m.sentAt DESC LIMIT 1")
    Message findLastMessageBetweenUsers(@Param("user1") Long user1Id,
                                        @Param("user2") Long user2Id);
}