package com.bankportfolio.controller;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import com.bankportfolio.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ProjectResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(projectService.findAll(page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProjectResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.search(query, page, size));
    }

    @GetMapping("/portfolio/{portfolioId}")
    public ResponseEntity<PagedResponse<ProjectResponse>> getByPortfolio(
            @PathVariable Long portfolioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.findByPortfolioId(portfolioId, page, size));
    }

    @GetMapping("/filter/status")
    public ResponseEntity<PagedResponse<ProjectResponse>> filterByStatus(
            @RequestParam ProjectStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.filterByStatus(status, page, size));
    }

    @GetMapping("/filter/health")
    public ResponseEntity<PagedResponse<ProjectResponse>> filterByHealth(
            @RequestParam ProjectHealth health,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.filterByHealth(health, page, size));
    }

    @GetMapping("/filter/priority")
    public ResponseEntity<PagedResponse<ProjectResponse>> filterByPriority(
            @RequestParam ProjectPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(projectService.filterByPriority(priority, page, size));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest request) {
        return new ResponseEntity<>(projectService.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
