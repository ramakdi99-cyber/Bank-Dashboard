package com.bankportfolio.service;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import com.bankportfolio.exception.ResourceNotFoundException;
import com.bankportfolio.repository.PortfolioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private com.bankportfolio.repository.ProjectRepository projectRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private PortfolioService portfolioService;

    private Portfolio testPortfolio;
    private PortfolioRequest portfolioRequest;

    @BeforeEach
    void setUp() {
        testPortfolio = Portfolio.builder()
                .id(1L)
                .name("Test Portfolio")
                .description("A test portfolio")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("1000000.00"))
                .actualCost(new BigDecimal("500000.00"))
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2025, 12, 31))
                .completionPercentage(new BigDecimal("50.00"))
                .projects(new java.util.ArrayList<>())
                .build();

        portfolioRequest = PortfolioRequest.builder()
                .name("Test Portfolio")
                .description("A test portfolio")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("1000000.00"))
                .actualCost(new BigDecimal("500000.00"))
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2025, 12, 31))
                .completionPercentage(new BigDecimal("50.00"))
                .build();
    }

    @Test
    void create_withValidRequest_returnsPortfolioResponse() {
        when(portfolioRepository.save(any(Portfolio.class))).thenReturn(testPortfolio);

        PortfolioResponse response = portfolioService.create(portfolioRequest);

        assertNotNull(response);
        assertEquals("Test Portfolio", response.getName());
        assertEquals("John Doe", response.getOwner());
        assertEquals(PortfolioStatus.ACTIVE, response.getStatus());
        assertEquals(PortfolioHealth.GREEN, response.getHealth());
        assertEquals(new BigDecimal("1000000.00"), response.getBudget());

        verify(portfolioRepository).save(any(Portfolio.class));
        verify(auditService).log(eq("CREATE"), eq("Portfolio"), eq(1L), isNull(), anyString());
    }

    @Test
    void findAll_withDefaultParams_returnsPagedResponse() {
        Page<Portfolio> portfolioPage = new PageImpl<>(List.of(testPortfolio), PageRequest.of(0, 10), 1);
        when(portfolioRepository.findAll(any(Pageable.class))).thenReturn(portfolioPage);

        PagedResponse<PortfolioResponse> response = portfolioService.findAll(0, 10, "id", "asc");

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(10, response.getSize());
        assertEquals(1, response.getTotalElements());
        assertEquals(1, response.getTotalPages());

        verify(portfolioRepository).findAll(any(Pageable.class));
    }

    @Test
    void findById_withExistingId_returnsPortfolioResponse() {
        when(portfolioRepository.findById(1L)).thenReturn(Optional.of(testPortfolio));

        PortfolioResponse response = portfolioService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Portfolio", response.getName());

        verify(portfolioRepository).findById(1L);
    }

    @Test
    void findById_withNonExistentId_throwsResourceNotFoundException() {
        when(portfolioRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> portfolioService.findById(999L));

        verify(portfolioRepository).findById(999L);
    }

    @Test
    void update_withExistingId_returnsUpdatedResponse() {
        when(portfolioRepository.findById(1L)).thenReturn(Optional.of(testPortfolio));
        when(portfolioRepository.save(any(Portfolio.class))).thenReturn(testPortfolio);

        PortfolioResponse response = portfolioService.update(1L, portfolioRequest);

        assertNotNull(response);
        assertEquals("Test Portfolio", response.getName());

        verify(portfolioRepository).findById(1L);
        verify(portfolioRepository).save(any(Portfolio.class));
        verify(auditService).log(eq("UPDATE"), eq("Portfolio"), eq(1L), anyString(), anyString());
    }

    @Test
    void update_withNonExistentId_throwsResourceNotFoundException() {
        when(portfolioRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> portfolioService.update(999L, portfolioRequest));

        verify(portfolioRepository).findById(999L);
        verify(portfolioRepository, never()).save(any());
    }

    @Test
    void delete_withExistingId_removesPortfolio() {
        when(portfolioRepository.findById(1L)).thenReturn(Optional.of(testPortfolio));

        portfolioService.delete(1L);

        verify(portfolioRepository).findById(1L);
        verify(portfolioRepository).delete(testPortfolio);
        verify(auditService).log(eq("DELETE"), eq("Portfolio"), eq(1L), anyString(), isNull());
    }

    @Test
    void delete_withNonExistentId_throwsResourceNotFoundException() {
        when(portfolioRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> portfolioService.delete(999L));

        verify(portfolioRepository).findById(999L);
        verify(portfolioRepository, never()).delete(any());
    }

    @Test
    void search_withQuery_returnsMatchingPortfolios() {
        Page<Portfolio> portfolioPage = new PageImpl<>(List.of(testPortfolio), PageRequest.of(0, 10), 1);
        when(portfolioRepository.search(eq("Test"), any(Pageable.class))).thenReturn(portfolioPage);

        PagedResponse<PortfolioResponse> response = portfolioService.search("Test", 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Test Portfolio", response.getContent().get(0).getName());

        verify(portfolioRepository).search(eq("Test"), any(Pageable.class));
    }

    @Test
    void getSummaries_withPortfolios_returnsList() {
        when(portfolioRepository.findAll()).thenReturn(List.of(testPortfolio));

        List<PortfolioSummary> summaries = portfolioService.getSummaries();

        assertNotNull(summaries);
        assertEquals(1, summaries.size());
        assertEquals("Test Portfolio", summaries.get(0).getName());

        verify(portfolioRepository).findAll();
    }

    @Test
    void getSummaries_withNoPortfolios_returnsEmptyList() {
        when(portfolioRepository.findAll()).thenReturn(Collections.emptyList());

        List<PortfolioSummary> summaries = portfolioService.getSummaries();

        assertNotNull(summaries);
        assertTrue(summaries.isEmpty());
    }

    @Test
    void filterByStatus_withExistingStatus_returnsFilteredPortfolios() {
        Page<Portfolio> portfolioPage = new PageImpl<>(List.of(testPortfolio), PageRequest.of(0, 10), 1);
        when(portfolioRepository.findByStatus(eq(PortfolioStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(portfolioPage);

        PagedResponse<PortfolioResponse> response = portfolioService.filterByStatus(PortfolioStatus.ACTIVE, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());

        verify(portfolioRepository).findByStatus(eq(PortfolioStatus.ACTIVE), any(Pageable.class));
    }
}
