package com.bankportfolio.controller;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import com.bankportfolio.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<PortfolioResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(portfolioService.findAll(page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<PortfolioResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(portfolioService.search(query, page, size));
    }

    @GetMapping("/filter/status")
    public ResponseEntity<PagedResponse<PortfolioResponse>> filterByStatus(
            @RequestParam PortfolioStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(portfolioService.filterByStatus(status, page, size));
    }

    @GetMapping("/filter/health")
    public ResponseEntity<PagedResponse<PortfolioResponse>> filterByHealth(
            @RequestParam PortfolioHealth health,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(portfolioService.filterByHealth(health, page, size));
    }

    @GetMapping("/summaries")
    public ResponseEntity<List<PortfolioSummary>> getSummaries() {
        return ResponseEntity.ok(portfolioService.getSummaries());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PortfolioResponse> create(@Valid @RequestBody PortfolioRequest request) {
        return new ResponseEntity<>(portfolioService.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioResponse> update(@PathVariable Long id, @Valid @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        portfolioService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Portfolio deleted successfully", null));
    }
}
