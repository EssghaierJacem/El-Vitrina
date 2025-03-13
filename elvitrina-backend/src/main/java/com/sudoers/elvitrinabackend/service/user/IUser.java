package com.sudoers.elvitrinabackend.service.user;

import com.sudoers.elvitrinabackend.model.dto.UserDTO;

import java.util.List;

public interface IUser {
    UserDTO createUser(UserDTO userDTO);
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(Long id, UserDTO userDTO);
    UserDTO register(UserDTO userDTO);
    UserDTO login(String email, String password);
    boolean verifyUser(String token);
    void deleteUser(Long id);
}