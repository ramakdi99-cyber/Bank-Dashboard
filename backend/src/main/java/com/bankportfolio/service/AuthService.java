package com.bankportfolio.service;

import com.bankportfolio.dto.AuthResponse;
import com.bankportfolio.dto.LoginRequest;
import com.bankportfolio.dto.RegisterRequest;
import com.bankportfolio.dto.UserDTO;
import com.bankportfolio.entity.Role;
import com.bankportfolio.entity.User;
import com.bankportfolio.entity.enums.RoleName;
import com.bankportfolio.exception.BadRequestException;
import com.bankportfolio.exception.ConflictException;
import com.bankportfolio.repository.RoleRepository;
import com.bankportfolio.repository.UserRepository;
import com.bankportfolio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDTO userDTO = mapToUserDTO(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDTO)
                .build();
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ConflictException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ConflictException("Email is already in use");
        }

        Role viewerRole = roleRepository.findByName(RoleName.VIEWER)
                .orElseThrow(() -> new BadRequestException("Default role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(viewerRole);

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .enabled(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        UserDTO userDTO = mapToUserDTO(savedUser);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDTO)
                .build();
    }

    private UserDTO mapToUserDTO(User user) {
        Set<RoleName> roleNames = new HashSet<>();
        for (Role role : user.getRoles()) {
            roleNames.add(role.getName());
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.isEnabled())
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
