package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.model.dto.FriendRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.MessageDTO;
import com.sudoers.elvitrinabackend.model.entity.FriendRequest;
import com.sudoers.elvitrinabackend.model.entity.Message;
import com.sudoers.elvitrinabackend.service.messages.MessageService;
import com.sudoers.elvitrinabackend.service.messages.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendRequestService friendRequestService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/sendRequest")
    public FriendRequestDTO sendFriendRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {
        return friendRequestService.sendFriendRequest(senderId, receiverId);
    }

    @PostMapping("/acceptRequest")
    public FriendRequestDTO acceptFriendRequest(@RequestParam Long requestId) {
        return friendRequestService.acceptFriendRequest(requestId);
    }

    @PostMapping("/rejectRequest")
    public FriendRequestDTO rejectFriendRequest(@RequestParam Long requestId) {
        return friendRequestService.rejectFriendRequest(requestId);
    }

    @GetMapping("/requests/{userId}")
    public List<FriendRequestDTO> getFriendRequests(@PathVariable Long userId) {
        return friendRequestService.getRequestsForUser(userId);
    }

    @GetMapping("/sentRequests/{userId}")
    public List<FriendRequestDTO> getSentRequests(@PathVariable Long userId) {
        return friendRequestService.getSentRequests(userId);
    }

    // Endpoint to get received requests
    @GetMapping("/receivedRequests/{userId}")
    public List<FriendRequestDTO> getReceivedRequests(@PathVariable Long userId) {
        return friendRequestService.getReceivedRequests(userId);
    }

    @DeleteMapping("/deleteRequest")
    public void deleteFriendRequest(@RequestParam Long requestId) {
        friendRequestService.deleteFriendRequest(requestId);
    }

    @PostMapping("/sendMessage")
    public Message sendMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO);
    }

    @GetMapping("/friends/{userId}")
    public List<FriendRequestDTO> getFriends(@PathVariable Long userId) {
        return friendRequestService.getAcceptedFriends(userId);
    }

    @GetMapping("/mutualFriends/{userId}")
    public List<FriendRequestDTO> getMutualFriends(@PathVariable Long userId) {
        return friendRequestService.getMutualFriends(userId);
    }
}
