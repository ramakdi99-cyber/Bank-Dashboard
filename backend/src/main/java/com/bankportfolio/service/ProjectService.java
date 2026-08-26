package com.bankportfolio.service;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.Project;
import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import com.bankportfolio.exception.ResourceNotFoundException;
import com.bankportfolio.repository.PortfolioRepository;
import com.bankportfolio.repository.ProjectRepository;
import com.bankportfolio.repository.ProjectRiskRepository;
import com.bankportfolio.repository.ProjectUpdateRepository;
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
public class ProjectService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private final ProjectRepository projectRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProjectRiskRepository projectRiskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final AuditService auditService;

    public ProjectService(ProjectRepository projectRepository,
                          PortfolioRepository portfolioRepository,
                          ProjectRiskRepository projectRiskRepository,
                          ProjectUpdateRepository projectUpdateRepository,
                          AuditService auditService) {
        this.projectRepository = projectRepository;
        this.portfolioRepository = portfolioRepository;
        this.projectRiskRepository = projectRiskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> findAll(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), sort);
        Page<Project> projects = projectRepository.findAll(pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Project> projects = projectRepository.search(query, pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> findByPortfolioId(Long portfolioId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Project> projects = projectRepository.findByPortfolioId(portfolioId, pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> filterByStatus(ProjectStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Project> projects = projectRepository.findByStatus(status, pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> filterByHealth(ProjectHealth health, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Project> projects = projectRepository.findByHealth(health, pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> filterByPriority(ProjectPriority priority, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100), Sort.by("name").ascending());
        Page<Project> projects = projectRepository.findByPriority(priority, pageable);
        return mapToPagedResponse(projects);
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        Portfolio portfolio = portfolioRepository.findById(request.getPortfolioId())
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio", request.getPortfolioId()));

        Project project = Project.builder()
                .portfolio(portfolio)
                .name(request.getName())
                .description(request.getDescription())
                .projectManager(request.getProjectManager())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNED)
                .health(request.getHealth() != null ? request.getHealth() : ProjectHealth.GREEN)
                .priority(request.getPriority() != null ? request.getPriority() : ProjectPriority.MEDIUM)
                .budget(request.getBudget())
                .actualCost(request.getActualCost() != null ? request.getActualCost() : java.math.BigDecimal.ZERO)
                .completionPercentage(request.getCompletionPercentage() != null ? request.getCompletionPercentage() : java.math.BigDecimal.ZERO)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Project saved = projectRepository.save(project);
        auditService.log("CREATE", "Project", saved.getId(), null, toJson(saved));
        return mapToResponse(saved);
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));

        String oldValues = toJson(project);

        if (!project.getPortfolio().getId().equals(request.getPortfolioId())) {
            Portfolio newPortfolio = portfolioRepository.findById(request.getPortfolioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Portfolio", request.getPortfolioId()));
            project.setPortfolio(newPortfolio);
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setProjectManager(request.getProjectManager());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        if (request.getHealth() != null) project.setHealth(request.getHealth());
        if (request.getPriority() != null) project.setPriority(request.getPriority());
        project.setBudget(request.getBudget());
        if (request.getActualCost() != null) project.setActualCost(request.getActualCost());
        if (request.getCompletionPercentage() != null) project.setCompletionPercentage(request.getCompletionPercentage());
        if (request.getStartDate() != null) project.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) project.setEndDate(request.getEndDate());

        Project updated = projectRepository.save(project);
        auditService.log("UPDATE", "Project", updated.getId(), oldValues, toJson(updated));
        return mapToResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        auditService.log("DELETE", "Project", project.getId(), toJson(project), null);
        projectRepository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        int riskCount = project.getRisks() != null ? project.getRisks().size() : 0;
        int updateCount = project.getUpdates() != null ? project.getUpdates().size() : 0;

        return ProjectResponse.builder()
                .id(project.getId())
                .portfolioId(project.getPortfolio().getId())
                .portfolioName(project.getPortfolio().getName())
                .name(project.getName())
                .description(project.getDescription())
                .projectManager(project.getProjectManager())
                .status(project.getStatus())
                .health(project.getHealth())
                .priority(project.getPriority())
                .budget(project.getBudget())
                .actualCost(project.getActualCost())
                .completionPercentage(project.getCompletionPercentage())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .riskCount(riskCount)
                .updateCount(updateCount)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private PagedResponse<ProjectResponse> mapToPagedResponse(Page<Project> page) {
        List<ProjectResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ProjectResponse>builder()
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
