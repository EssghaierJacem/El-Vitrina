package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.FriendRequest;
import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long>{

    List<FriendRequest> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    List<FriendRequest> findByStatusAndSenderIdOrReceiverId(RequestStatus status, Long senderId, Long receiverId);

}
