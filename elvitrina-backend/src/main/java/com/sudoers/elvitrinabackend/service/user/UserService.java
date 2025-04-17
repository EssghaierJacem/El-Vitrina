package com.sudoers.elvitrinabackend.service.user;

import com.sudoers.elvitrinabackend.model.dto.UserDTO;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements IUser {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    private EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
            // Generate a unique filename
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            // Define the upload directory (you can change this path)
            Path uploadPath = Paths.get("uploads/user-images");

            // Create directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the server
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update user image field in the database
            user.setImage(fileName);
            User savedUser = userRepository.save(user);

            // Return DTO
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

}
