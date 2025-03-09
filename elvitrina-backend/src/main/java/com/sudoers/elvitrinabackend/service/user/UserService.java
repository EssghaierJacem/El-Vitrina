package com.sudoers.elvitrinabackend.service.user;

import com.sudoers.elvitrinabackend.model.dto.UserDTO;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                savedUser.getPassword()
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
                user.getPassword()
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
                        user.getPassword()
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
                updatedUser.getPassword()
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
        user.setStatus(userDTO.isStatus());
        user.setPoints(userDTO.getPoints());
        user.setActive(userDTO.isActive());
        user.setRole(userDTO.getRole());

        user.setPassword(userDTO.getPassword());

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
                savedUser.getPassword()
        );
    }

    public UserDTO login(String emailOrPhone, String password) {
        Optional<User> userOptional = userRepository.findByEmail(emailOrPhone);

        if (!userOptional.isPresent()) {
            userOptional = userRepository.findByPhone(emailOrPhone);
        }

        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with the given email or phone");
        }

        User user = userOptional.get();

        if (!password.equals(user.getPassword())) {
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
                user.getPassword()
        );
    }
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
