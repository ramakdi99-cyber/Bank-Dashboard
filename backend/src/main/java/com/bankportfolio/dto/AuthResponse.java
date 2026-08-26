package com.bankportfolio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private UserDTO user;

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = user;
    }
}
