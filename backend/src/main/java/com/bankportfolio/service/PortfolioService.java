package com.bankportfolio.service;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.Project;
import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import com.bankportfolio.exception.ResourceNotFoundException;
import com.bankportfolio.repository.PortfolioRepository;
import com.bankportfolio.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            ProjectRepository projectRepository,
                            AuditService auditService) {
        this.portfolioRepository = portfolioRepository;
        this.projectRepository = projectRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PortfolioResponse> findAll(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), sort);
        Page<Portfolio> portfolios = portfolioRepository.findAll(pageable);
        return mapToPagedResponse(portfolios);
    }

    @Transactional(readOnly = true)
    public PortfolioResponse findById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", id));
        return mapToResponse(portfolio);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PortfolioResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Portfolio> portfolios = portfolioRepository.search(query, pageable);
        return mapToPagedResponse(portfolios);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PortfolioResponse> filterByStatus(PortfolioStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Portfolio> portfolios = portfolioRepository.findByStatus(status, pageable);
        return mapToPagedResponse(portfolios);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PortfolioResponse> filterByHealth(PortfolioHealth health, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Portfolio> portfolios = portfolioRepository.findByHealth(health, pageable);
        return mapToPagedResponse(portfolios);
    }

    @Transactional
    public PortfolioResponse create(PortfolioRequest request) {
        Portfolio portfolio = Portfolio.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(request.getOwner())
                .status(request.getStatus() != null ? request.getStatus() : PortfolioStatus.ACTIVE)
                .health(request.getHealth() != null ? request.getHealth() : PortfolioHealth.GREEN)
                .budget(request.getBudget())
                .actualCost(request.getActualCost() != null ? request.getActualCost() : java.math.BigDecimal.ZERO)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .completionPercentage(request.getCompletionPercentage() != null ? request.getCompletionPercentage() : java.math.BigDecimal.ZERO)
                .build();

        Portfolio saved = portfolioRepository.save(portfolio);
        auditService.log("CREATE", "Portfolio", saved.getId(), null, toJson(saved));
        return mapToResponse(saved);
    }

    @Transactional
    public PortfolioResponse update(Long id, PortfolioRequest request) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", id));

        String oldValues = toJson(portfolio);

        portfolio.setName(request.getName());
        portfolio.setDescription(request.getDescription());
        portfolio.setOwner(request.getOwner());
        if (request.getStatus() != null) portfolio.setStatus(request.getStatus());
        if (request.getHealth() != null) portfolio.setHealth(request.getHealth());
        portfolio.setBudget(request.getBudget());
        if (request.getActualCost() != null) portfolio.setActualCost(request.getActualCost());
        if (request.getStartDate() != null) portfolio.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) portfolio.setEndDate(request.getEndDate());
        if (request.getCompletionPercentage() != null) portfolio.setCompletionPercentage(request.getCompletionPercentage());

        Portfolio updated = portfolioRepository.save(portfolio);
        auditService.log("UPDATE", "Portfolio", updated.getId(), oldValues, toJson(updated));
        return mapToResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", id));
        auditService.log("DELETE", "Portfolio", portfolio.getId(), toJson(portfolio), null);
        portfolioRepository.delete(portfolio);
    }

    @Transactional(readOnly = true)
    public List<PortfolioSummary> getSummaries() {
        return portfolioRepository.findAll().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    private PortfolioResponse mapToResponse(Portfolio portfolio) {
        int projectCount = portfolio.getProjects() != null ? portfolio.getProjects().size() : 0;

        return PortfolioResponse.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .description(portfolio.getDescription())
                .owner(portfolio.getOwner())
                .status(portfolio.getStatus())
                .health(portfolio.getHealth())
                .budget(portfolio.getBudget())
                .actualCost(portfolio.getActualCost())
                .startDate(portfolio.getStartDate())
                .endDate(portfolio.getEndDate())
                .completionPercentage(portfolio.getCompletionPercentage())
                .projectCount(projectCount)
                .createdAt(portfolio.getCreatedAt())
                .updatedAt(portfolio.getUpdatedAt())
                .build();
    }

    private PortfolioSummary mapToSummary(Portfolio portfolio) {
        int projectCount = portfolio.getProjects() != null ? portfolio.getProjects().size() : 0;

        return PortfolioSummary.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .status(portfolio.getStatus())
                .health(portfolio.getHealth())
                .budget(portfolio.getBudget())
                .completionPercentage(portfolio.getCompletionPercentage())
                .projectCount(projectCount)
                .build();
    }

    private PagedResponse<PortfolioResponse> mapToPagedResponse(Page<Portfolio> page) {
        List<PortfolioResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PortfolioResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    private String toJson(Object obj) {
        try {
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
