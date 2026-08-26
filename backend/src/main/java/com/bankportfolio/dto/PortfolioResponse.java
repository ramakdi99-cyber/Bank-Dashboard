package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioResponse {

    private Long id;
    private String name;
    private String description;
    private String owner;
    private PortfolioStatus status;
    private PortfolioHealth health;
    private BigDecimal budget;
    private BigDecimal actualCost;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal completionPercentage;
    private int projectCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
