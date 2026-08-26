package com.bankportfolio.controller;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import com.bankportfolio.exception.ResourceNotFoundException;
import com.bankportfolio.service.PortfolioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PortfolioService portfolioService;

    private PortfolioResponse createMockPortfolioResponse() {
        return PortfolioResponse.builder()
                .id(1L)
                .name("Digital Banking")
                .description("Digital transformation initiative")
                .owner("Sarah Mitchell")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("5000000.00"))
                .actualCost(new BigDecimal("2350000.00"))
                .completionPercentage(new BigDecimal("47.00"))
                .projectCount(4)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAll_returnsPagedResponse() throws Exception {
        PagedResponse<PortfolioResponse> pagedResponse = PagedResponse.<PortfolioResponse>builder()
                .content(List.of(createMockPortfolioResponse()))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();

        when(portfolioService.findAll(0, 10, "id", "asc")).thenReturn(pagedResponse);

        mockMvc.perform(get("/api/portfolios")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortBy", "id")
                        .param("sortDir", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Digital Banking"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void create_withAdminRole_returns201() throws Exception {
        PortfolioRequest request = PortfolioRequest.builder()
                .name("New Portfolio")
                .description("A new portfolio")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("1000000.00"))
                .build();

        PortfolioResponse response = PortfolioResponse.builder()
                .id(2L)
                .name("New Portfolio")
                .description("A new portfolio")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("1000000.00"))
                .projectCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(portfolioService.create(any(PortfolioRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/portfolios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Portfolio"))
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    @WithMockUser(username = "viewer", roles = {"VIEWER"})
    void create_withViewerRole_returns403() throws Exception {
        PortfolioRequest request = PortfolioRequest.builder()
                .name("New Portfolio")
                .description("A new portfolio")
                .owner("John Doe")
                .budget(new BigDecimal("1000000.00"))
                .build();

        mockMvc.perform(post("/api/portfolios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getById_withExistingId_returnsPortfolio() throws Exception {
        PortfolioResponse response = createMockPortfolioResponse();
        when(portfolioService.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/portfolios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Digital Banking"))
                .andExpect(jsonPath("$.owner").value("Sarah Mitchell"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getById_withNonExistentId_returns404() throws Exception {
        when(portfolioService.findById(999L))
                .thenThrow(new ResourceNotFoundException("Portfolio", 999L));

        mockMvc.perform(get("/api/portfolios/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void delete_withExistingId_returns200() throws Exception {
        doNothing().when(portfolioService).delete(1L);

        mockMvc.perform(delete("/api/portfolios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void update_withExistingId_returnsUpdatedPortfolio() throws Exception {
        PortfolioRequest request = PortfolioRequest.builder()
                .name("Updated Portfolio")
                .description("Updated description")
                .owner("John Doe")
                .budget(new BigDecimal("2000000.00"))
                .build();

        PortfolioResponse response = PortfolioResponse.builder()
                .id(1L)
                .name("Updated Portfolio")
                .description("Updated description")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("2000000.00"))
                .projectCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(portfolioService.update(eq(1L), any(PortfolioRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/portfolios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Portfolio"))
                .andExpect(jsonPath("$.budget").value(2000000.00));
    }

    @Test
    void getAll_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/portfolios"))
                .andExpect(status().isUnauthorized());
    }
}
