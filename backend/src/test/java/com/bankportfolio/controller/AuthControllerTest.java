package com.bankportfolio.controller;

import com.bankportfolio.dto.AuthResponse;
import com.bankportfolio.dto.LoginRequest;
import com.bankportfolio.dto.RegisterRequest;
import com.bankportfolio.dto.UserDTO;
import com.bankportfolio.entity.enums.RoleName;
import com.bankportfolio.exception.ConflictException;
import com.bankportfolio.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void login_withValidCredentials_returnsToken() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("admin")
                .password("admin123")
                .build();

        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("admin")
                .email("admin@bankportfolio.com")
                .firstName("John")
                .lastName("Administrator")
                .enabled(true)
                .roles(Set.of(RoleName.ADMIN))
                .createdAt(LocalDateTime.now())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt-test-token")
                .tokenType("Bearer")
                .user(userDTO)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-test-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.username").value("admin"));
    }

    @Test
    void login_withWrongPassword_returns401() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("admin")
                .password("wrongpassword")
                .build();

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_withEmptyCredentials_returns400() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("")
                .password("")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withValidRequest_returnsCreated() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newuser")
                .email("new@example.com")
                .password("password123")
                .firstName("New")
                .lastName("User")
                .build();

        UserDTO userDTO = UserDTO.builder()
                .id(2L)
                .username("newuser")
                .email("new@example.com")
                .firstName("New")
                .lastName("User")
                .enabled(true)
                .roles(Set.of(RoleName.VIEWER))
                .createdAt(LocalDateTime.now())
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt-new-token")
                .tokenType("Bearer")
                .user(userDTO)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-new-token"))
                .andExpect(jsonPath("$.user.username").value("newuser"));
    }

    @Test
    void register_withDuplicateUsername_returns409() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("existinguser")
                .email("existing@example.com")
                .password("password123")
                .firstName("Existing")
                .lastName("User")
                .build();

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new ConflictException("Username is already taken"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_withMissingUsername_returns400() throws Exception {
        String requestBody = "{\"password\": \"admin123\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_withMissingPassword_returns400() throws Exception {
        String requestBody = "{\"username\": \"admin\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
