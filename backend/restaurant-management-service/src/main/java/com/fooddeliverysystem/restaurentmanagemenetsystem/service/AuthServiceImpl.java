package com.fooddeliverysystem.restaurentmanagemenetsystem.service;

import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.LoginDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.dto.UserDTO;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.InvalidCredentialsException;
import com.fooddeliverysystem.restaurentmanagemenetsystem.exception.ResourceNotFoundException;
import com.fooddeliverysystem.restaurentmanagemenetsystem.model.User;
import com.fooddeliverysystem.restaurentmanagemenetsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.fooddeliverysystem.restaurentmanagemenetsystem.security.JwtUtils jwtUtils;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    public UserDTO register(UserDTO userDTO) {
        try {
            // Check if user already exists
            if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already registered");
            }

            User user = User.builder()
                    .username(userDTO.getUsername())
                    .email(userDTO.getEmail())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .role(User.Role.fromString(userDTO.getRole()))
                    .build();

            user = userRepository.save(user);
            log.info("User registered successfully: {}", user.getEmail());
            return convertToUserDTO(user);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public UserDTO login(LoginDTO loginDTO) {
        log.info("Attempting login for email: {}", loginDTO.getEmail());

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
                    log.error("Login failed - Email not found: {}", loginDTO.getEmail());
                    return new ResourceNotFoundException("No account found with this email");
                });

        log.debug("Found user: {}", user.getEmail());

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            log.error("Password mismatch for user: {}", user.getEmail());
            throw new InvalidCredentialsException("Incorrect password");
        }

        log.info("Login successful for user: {}", user.getEmail());
        
        // Load user details and generate token
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        
        UserDTO userDTO = convertToUserDTO(user);
        userDTO.setToken(token); // Need to add token field to UserDTO
        return userDTO;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(String id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User not found with ID: " + id);
                });
        return convertToUserDTO(user);
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}