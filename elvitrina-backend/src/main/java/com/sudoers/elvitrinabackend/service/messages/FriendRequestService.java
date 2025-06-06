package com.sudoers.elvitrinabackend.service.messages;

import com.sudoers.elvitrinabackend.model.dto.FriendRequestDTO;
import com.sudoers.elvitrinabackend.model.entity.FriendRequest;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import com.sudoers.elvitrinabackend.repository.FriendRequestRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public FriendRequestDTO sendFriendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setSender(sender);
        friendRequest.setReceiver(receiver);
        friendRequest.setStatus(RequestStatus.PENDING);
        friendRequest.setSentAt(LocalDateTime.now());

        FriendRequest savedRequest = friendRequestRepository.save(friendRequest);

        return new FriendRequestDTO(
                savedRequest.getId(),
                savedRequest.getSender().getId(),
                savedRequest.getSender().getFirstname(),
                savedRequest.getSender().getLastname(),
                savedRequest.getReceiver().getId(),
                savedRequest.getReceiver().getFirstname(),
                savedRequest.getReceiver().getLastname(),
                savedRequest.getStatus(),
                savedRequest.getSentAt()
        );
    }

    public FriendRequestDTO acceptFriendRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Friend request not found"));
        request.setStatus(RequestStatus.ACCEPTED);
        FriendRequest updatedRequest = friendRequestRepository.save(request);

        return new FriendRequestDTO(
                updatedRequest.getId(),
                updatedRequest.getSender().getId(),
                updatedRequest.getSender().getFirstname(),
                updatedRequest.getSender().getLastname(),
                updatedRequest.getReceiver().getId(),
                updatedRequest.getReceiver().getFirstname(),
                updatedRequest.getReceiver().getLastname(),
                updatedRequest.getStatus(),
                updatedRequest.getSentAt()
        );
    }

    public FriendRequestDTO rejectFriendRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Friend request not found"));
        request.setStatus(RequestStatus.REJECTED);
        FriendRequest updatedRequest = friendRequestRepository.save(request);

        return new FriendRequestDTO(
                updatedRequest.getId(),
                updatedRequest.getSender().getId(),
                updatedRequest.getSender().getFirstname(),
                updatedRequest.getSender().getLastname(),
                updatedRequest.getReceiver().getId(),
                updatedRequest.getReceiver().getFirstname(),
                updatedRequest.getReceiver().getLastname(),
                updatedRequest.getStatus(),
                updatedRequest.getSentAt()
        );
    }

    public void deleteFriendRequest(Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Friend request not found"));
        friendRequestRepository.delete(request);
    }

    public List<FriendRequestDTO> getRequestsForUser(Long userId) {
        List<FriendRequest> requests = friendRequestRepository.findBySenderIdOrReceiverId(userId, userId);

        return requests.stream()
                .map(request -> new FriendRequestDTO(
                        request.getId(),
                        request.getSender().getId(),
                        request.getSender().getFirstname(),
                        request.getSender().getLastname(),
                        request.getReceiver().getId(),
                        request.getReceiver().getFirstname(),
                        request.getReceiver().getLastname(),
                        request.getStatus(),
                        request.getSentAt()
                ))
                .collect(Collectors.toList());
    }

    public List<FriendRequestDTO> getAcceptedFriends(Long userId) {
        System.out.println("Fetching accepted friends for userId: " + userId);

        List<FriendRequest> requests = friendRequestRepository.findByStatusAndSenderIdOrReceiverId(RequestStatus.ACCEPTED, userId, userId);

        System.out.println("Retrieved " + requests.size() + " accepted requests for userId: " + userId);

        return requests.stream()
                .filter(request ->
                        (request.getSender().getId().equals(userId) && request.getReceiver().getId() != null) ||
                                (request.getReceiver().getId().equals(userId) && request.getSender().getId() != null)
                )
                .map(request -> {
                    System.out.println("Mapping friend request for senderId: " + request.getSender().getId() + " and receiverId: " + request.getReceiver().getId());
                    return new FriendRequestDTO(
                            request.getId(),
                            request.getSender().getId(),
                            request.getSender().getFirstname(),
                            request.getSender().getLastname(),
                            request.getReceiver().getId(),
                            request.getReceiver().getFirstname(),
                            request.getReceiver().getLastname(),
                            request.getStatus(),
                            request.getSentAt()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<FriendRequestDTO> getMutualFriends(Long userId) {
        List<FriendRequest> requests = friendRequestRepository.findByStatusAndSenderIdOrReceiverId(RequestStatus.ACCEPTED, userId, userId);
        Set<Long> processedIds = new HashSet<>();

        return requests.stream()
                .flatMap(request -> {
                    if (request.getSender().getId().equals(userId)) {
                        if (processedIds.add(request.getReceiver().getId())) {
                            return Stream.of(new FriendRequestDTO(
                                    request.getId(),
                                    request.getReceiver().getId(),
                                    request.getReceiver().getFirstname(),
                                    request.getReceiver().getLastname(),
                                    request.getSender().getId(),
                                    request.getSender().getFirstname(),
                                    request.getSender().getLastname(),
                                    request.getStatus(),
                                    request.getSentAt()
                            ));
                        }
                    }
                    if (request.getReceiver().getId().equals(userId)) {
                        if (processedIds.add(request.getSender().getId())) {
                            return Stream.of(new FriendRequestDTO(
                                    request.getId(),
                                    request.getSender().getId(),
                                    request.getSender().getFirstname(),
                                    request.getSender().getLastname(),
                                    request.getReceiver().getId(),
                                    request.getReceiver().getFirstname(),
                                    request.getReceiver().getLastname(),
                                    request.getStatus(),
                                    request.getSentAt()
                            ));
                        }
                    }
                    return Stream.empty();
                })
                .collect(Collectors.toList());
    }


    public List<FriendRequestDTO> getSentRequests(Long userId) {
        List<FriendRequest> requests = friendRequestRepository.findBySenderId(userId);

        Set<Long> uniqueReceiverIds = new HashSet<>();

        List<FriendRequestDTO> sentRequests = requests.stream()
                .filter(request -> {
                    boolean isUnique = uniqueReceiverIds.add(request.getReceiver().getId());
                    return isUnique;
                })
                .map(request -> new FriendRequestDTO(
                        request.getId(),
                        request.getSender().getId(),
                        request.getSender().getFirstname(),
                        request.getSender().getLastname(),
                        request.getReceiver().getId(),
                        request.getReceiver().getFirstname(),
                        request.getReceiver().getLastname(),
                        request.getStatus(),
                        request.getSentAt()
                ))
                .collect(Collectors.toList());

        return sentRequests;
    }

    public List<FriendRequestDTO> getReceivedRequests(Long userId) {
        List<FriendRequest> requests = friendRequestRepository.findByReceiverId(userId);

        Set<Long> uniqueSenderIds = new HashSet<>();

        List<FriendRequestDTO> receivedRequests = requests.stream()
                .filter(request -> {
                    boolean isUnique = uniqueSenderIds.add(request.getSender().getId());
                    return isUnique;
                })
                .map(request -> new FriendRequestDTO(
                        request.getId(),
                        request.getSender().getId(),
                        request.getSender().getFirstname(),
                        request.getSender().getLastname(),
                        request.getReceiver().getId(),
                        request.getReceiver().getFirstname(),
                        request.getReceiver().getLastname(),
                        request.getStatus(),
                        request.getSentAt()
                ))
                .collect(Collectors.toList());

        return receivedRequests;
    }

}
