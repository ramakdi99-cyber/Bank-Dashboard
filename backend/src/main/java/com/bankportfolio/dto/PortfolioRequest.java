package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioRequest {

    @NotBlank(message = "Portfolio name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotBlank(message = "Owner is required")
    @Size(max = 100, message = "Owner must not exceed 100 characters")
    private String owner;

    private PortfolioStatus status;

    private PortfolioHealth health;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budget must be greater than 0")
    private BigDecimal budget;

    private BigDecimal actualCost;

    private LocalDate startDate;

    private LocalDate endDate;

    @DecimalMin(value = "0.0", message = "Completion percentage cannot be negative")
    @DecimalMax(value = "100.0", message = "Completion percentage cannot exceed 100")
    private BigDecimal completionPercentage;
}
