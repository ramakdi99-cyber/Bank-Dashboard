package com.bankportfolio.controller;

import com.bankportfolio.dto.DashboardAnalytics;
import com.bankportfolio.dto.DashboardSummary;
import com.bankportfolio.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getSummary_authenticated_returns200() throws Exception {
        DashboardSummary summary = DashboardSummary.builder()
                .totalPortfolios(5L)
                .totalProjects(16L)
                .activeProjects(10L)
                .completedProjects(3L)
                .delayedProjects(2L)
                .atRiskProjects(2L)
                .totalBudget(new BigDecimal("18600000"))
                .totalActualCost(new BigDecimal("9075000"))
                .totalRisks(6L)
                .openRisks(4L)
                .build();

        when(dashboardService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPortfolios").value(5))
                .andExpect(jsonPath("$.totalProjects").value(16))
                .andExpect(jsonPath("$.activeProjects").value(10))
                .andExpect(jsonPath("$.completedProjects").value(3))
                .andExpect(jsonPath("$.delayedProjects").value(2))
                .andExpect(jsonPath("$.atRiskProjects").value(2));
    }

    @Test
    void getSummary_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAnalytics_authenticated_returns200() throws Exception {
        DashboardAnalytics analytics = DashboardAnalytics.builder()
                .build();

        when(dashboardService.getAnalytics()).thenReturn(analytics);

        mockMvc.perform(get("/api/dashboard/analytics"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getSummary_withViewerRole_returns200() throws Exception {
        DashboardSummary summary = DashboardSummary.builder()
                .totalPortfolios(0L)
                .totalProjects(0L)
                .activeProjects(0L)
                .completedProjects(0L)
                .delayedProjects(0L)
                .atRiskProjects(0L)
                .totalBudget(BigDecimal.ZERO)
                .totalActualCost(BigDecimal.ZERO)
                .totalRisks(0L)
                .openRisks(0L)
                .build();

        when(dashboardService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPortfolios").value(0));
    }
}
