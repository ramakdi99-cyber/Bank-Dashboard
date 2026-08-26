package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequest {

    @NotNull(message = "Portfolio ID is required")
    private Long portfolioId;

    @NotBlank(message = "Project name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 100, message = "Project manager must not exceed 100 characters")
    private String projectManager;

    private ProjectStatus status;

    private ProjectHealth health;

    private ProjectPriority priority;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be greater than 0")
    private BigDecimal budget;

    private BigDecimal actualCost;

    @DecimalMin(value = "0.0", message = "Completion percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Completion percentage cannot exceed 100")
    private BigDecimal completionPercentage;

    private LocalDate startDate;

    private LocalDate endDate;
}
