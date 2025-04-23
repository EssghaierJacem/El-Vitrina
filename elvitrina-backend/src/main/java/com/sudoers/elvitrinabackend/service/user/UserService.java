package com.sudoers.elvitrinabackend.service.user;

import com.sudoers.elvitrinabackend.model.dto.RecentActivityDTO;
import com.sudoers.elvitrinabackend.model.dto.UserDTO;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements IUser {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StoreRepository storeRepository;
    private final BlogPostRepository blogPostRepository;
    private final DonationRepository donationRepository;
    private final OfferRepository offerRepository;


    @Autowired
    private EmailService emailService;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, StoreRepository storeRepository, DonationRepository donationRepository, OfferRepository offerRepository, BlogPostRepository blogPostRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.storeRepository = storeRepository;
        this.donationRepository = donationRepository;
        this.offerRepository = offerRepository;
        this.blogPostRepository = blogPostRepository;
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setLastname(userDTO.getLastname());
        user.setFirstname(userDTO.getFirstname());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setRegistrationDate(userDTO.getRegistrationDate());
        user.setStatus(userDTO.isStatus());
        user.setPoints(userDTO.getPoints());
        user.setActive(userDTO.isActive());
        user.setRole(userDTO.getRole());
        user.setImage(userDTO.getImage());

        User savedUser = userRepository.save(user);
        return new UserDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getLastname(),
                savedUser.getFirstname(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAddress(),
                savedUser.getRegistrationDate(),
                savedUser.isStatus(),
                savedUser.getPoints(),
                savedUser.isActive(),
                savedUser.getRole(),
                savedUser.getPassword(),
                savedUser.getImage()
        );
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getLastname(),
                user.getFirstname(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRegistrationDate(),
                user.isStatus(),
                user.getPoints(),
                user.isActive(),
                user.getRole(),
                user.getPassword(),
                user.getImage()
        );
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getLastname(),
                        user.getFirstname(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getRegistrationDate(),
                        user.isStatus(),
                        user.getPoints(),
                        user.isActive(),
                        user.getRole(),
                        user.getPassword(),
                        user.getImage()
                ))
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(userDTO.getName());
        user.setLastname(userDTO.getLastname());
        user.setFirstname(userDTO.getFirstname());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setStatus(userDTO.isStatus());
        user.setPoints(userDTO.getPoints());
        user.setActive(userDTO.isActive());
        user.setRole(userDTO.getRole());
        user.setImage(userDTO.getImage());

        User updatedUser = userRepository.save(user);
        return new UserDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getLastname(),
                updatedUser.getFirstname(),
                updatedUser.getEmail(),
                updatedUser.getPhone(),
                updatedUser.getAddress(),
                updatedUser.getRegistrationDate(),
                updatedUser.isStatus(),
                updatedUser.getPoints(),
                updatedUser.isActive(),
                updatedUser.getRole(),
                updatedUser.getPassword(),
                updatedUser.getImage()

        );
    }

    public UserDTO register(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        existingUser = userRepository.findByPhone(userDTO.getPhone());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this phone number already exists");
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setLastname(userDTO.getLastname());
        user.setFirstname(userDTO.getFirstname());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setRegistrationDate(userDTO.getRegistrationDate());

        user.setStatus(false);

        user.setPoints(userDTO.getPoints());
        user.setActive(userDTO.isActive());
        user.setRole(userDTO.getRole());
        user.setPassword(userDTO.getPassword());
        user.setImage(userDTO.getImage());

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        User savedUser = userRepository.save(user);

        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFirstname(),token);

        return new UserDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getLastname(),
                savedUser.getFirstname(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAddress(),
                savedUser.getRegistrationDate(),
                savedUser.isStatus(),
                savedUser.getPoints(),
                savedUser.isActive(),
                savedUser.getRole(),
                savedUser.getPassword(),
                savedUser.getImage()
        );
    }

    public UserDTO login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        if (!user.isStatus()) {
            throw new RuntimeException("Your account is disabled. Please contact support.");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getLastname(),
                user.getFirstname(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRegistrationDate(),
                user.isStatus(),
                user.getPoints(),
                user.isActive(),
                user.getRole(),
                user.getPassword(),
                user.getImage()
        );
    }

    public boolean verifyUser(String token) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setStatus(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public UserDTO uploadUserImage(Long userId, MultipartFile imageFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            String uuid = UUID.randomUUID().toString();
            String extension = getExtension(imageFile.getOriginalFilename());
            String fileName = uuid + "." + extension;

            Path uploadPath = Paths.get("uploads/user-images");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            user.setImage(fileName);
            User savedUser = userRepository.save(user);

            return new UserDTO(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getLastname(),
                    savedUser.getFirstname(),
                    savedUser.getEmail(),
                    savedUser.getPhone(),
                    savedUser.getAddress(),
                    savedUser.getRegistrationDate(),
                    savedUser.isStatus(),
                    savedUser.getPoints(),
                    savedUser.isActive(),
                    savedUser.getRole(),
                    savedUser.getPassword(),
                    savedUser.getImage()
            );

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }



    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public void forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("No user found with this email");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);

        emailService.sendResetPasswordEmail(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid or expired token.");
        }

        User user = optionalUser.get();

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password must be different from the old one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationToken(null);
        userRepository.save(user);
    }
    public void changePassword(Long id, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password must be different from the current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
    }
    private String getExtension(String originalFilename) {
        if (originalFilename == null) {
            return "jpg";
        }
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot == -1) {
            return "jpg";
        }
        return originalFilename.substring(lastDot + 1);
    }

    public List<RecentActivityDTO> getRecentActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

        userRepository.findAll().forEach(user -> {
            if (user.getRegistrationDate() != null) {
                activities.add(
                        RecentActivityDTO.builder()
                                .id(user.getId())
                                .time(user.getRegistrationDate().format(formatter))
                                .realDate(user.getRegistrationDate())
                                .color("primary")
                                .title("New User Registered")
                                .description(user.getFirstname() + " " + user.getLastname() + " (" + user.getEmail() + ")")
                                .link("/dashboard/users/" + user.getId())
                                .build()
                );
            }
        });

        storeRepository.findAll().forEach(store -> {
            if (store.getCreatedAt() != null) {
                activities.add(
                        RecentActivityDTO.builder()
                                .id(store.getStoreId())
                                .time(store.getCreatedAt().format(formatter))
                                .realDate(store.getCreatedAt())
                                .color("success")
                                .title("New Store Created")
                                .description(store.getStoreName() + " by " + store.getUser().getFirstname())
                                .link("/dashboard/stores/" + store.getStoreId())
                                .build()
                );
            }
        });

        blogPostRepository.findAll().forEach(post -> {
            if (post.getCreatedAt() != null) {
                activities.add(
                        RecentActivityDTO.builder()
                                .id(post.getId())
                                .time(post.getCreatedAt().format(formatter))
                                .realDate(post.getCreatedAt())
                                .color("accent")
                                .title("New Blog Post Published")
                                .description(post.getTitle())
                                .link("/blog/" + post.getId())
                                .build()
                );
            }
        });

        offerRepository.findAll().forEach(offer -> {
            if (offer.getStartDate() != null) {
                activities.add(
                        RecentActivityDTO.builder()
                                .id(offer.getId())
                                .time(offer.getStartDate().format(formatter))
                                .realDate(offer.getStartDate())
                                .color("warning")
                                .title("New Offer Published")
                                .description(offer.getName())
                                .link("/offers/" + offer.getId())
                                .build()
                );
            }
        });

        donationRepository.findAll().forEach(donation -> {
            if (donation.getCreatedAt() != null) {
                activities.add(
                        RecentActivityDTO.builder()
                                .id(donation.getDonationId())
                                .time(donation.getCreatedAt().format(formatter))
                                .realDate(donation.getCreatedAt())
                                .color("error")
                                .title("New Donation")
                                .description("Donation by " + donation.getUser().getFirstname())
                                .link("/donations/" + donation.getDonationId())
                                .build()
                );
            }
        });

        activities.sort((a, b) -> {
            return b.getRealDate().compareTo(a.getRealDate());
        });

        return activities.stream()
                .limit(6)
                .collect(Collectors.toList());
    }

}
