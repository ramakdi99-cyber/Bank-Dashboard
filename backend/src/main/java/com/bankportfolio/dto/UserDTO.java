package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.RoleName;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean enabled;
    private Set<RoleName> roles;
    private LocalDateTime createdAt;
}
