package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioSummary {

    private Long id;
    private String name;
    private PortfolioStatus status;
    private PortfolioHealth health;
    private BigDecimal budget;
    private BigDecimal completionPercentage;
    private int projectCount;
}
