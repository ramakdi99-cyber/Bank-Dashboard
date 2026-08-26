package com.bankportfolio.service;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.Project;
import com.bankportfolio.entity.enums.PortfolioStatus;
import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import com.bankportfolio.exception.ResourceNotFoundException;
import com.bankportfolio.repository.PortfolioRepository;
import com.bankportfolio.repository.ProjectRepository;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private com.bankportfolio.repository.ProjectRiskRepository projectRiskRepository;

    @Mock
    private com.bankportfolio.repository.ProjectUpdateRepository projectUpdateRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ProjectService projectService;

    private Portfolio testPortfolio;
    private Project testProject;
    private ProjectRequest projectRequest;

    @BeforeEach
    void setUp() {
        testPortfolio = Portfolio.builder()
                .id(1L)
                .name("Test Portfolio")
                .description("A test portfolio")
                .owner("John Doe")
                .status(PortfolioStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .budget(new BigDecimal("1000000.00"))
                .projects(new java.util.ArrayList<>())
                .build();

        testProject = Project.builder()
                .id(1L)
                .portfolio(testPortfolio)
                .name("Test Project")
                .description("A test project")
                .projectManager("Jane Smith")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("500000.00"))
                .actualCost(new BigDecimal("250000.00"))
                .completionPercentage(new BigDecimal("50.00"))
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2025, 6, 30))
                .risks(new java.util.ArrayList<>())
                .updates(new java.util.ArrayList<>())
                .build();

        projectRequest = ProjectRequest.builder()
                .portfolioId(1L)
                .name("Test Project")
                .description("A test project")
                .projectManager("Jane Smith")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("500000.00"))
                .actualCost(new BigDecimal("250000.00"))
                .completionPercentage(new BigDecimal("50.00"))
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2025, 6, 30))
                .build();
    }

    @Test
    void create_withValidRequest_returnsProjectResponse() {
        when(portfolioRepository.findById(1L)).thenReturn(Optional.of(testPortfolio));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.create(projectRequest);

        assertNotNull(response);
        assertEquals("Test Project", response.getName());
        assertEquals("Jane Smith", response.getProjectManager());
        assertEquals(ProjectStatus.ACTIVE, response.getStatus());
        assertEquals(ProjectPriority.HIGH, response.getPriority());

        verify(portfolioRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
        verify(auditService).log(eq("CREATE"), eq("Project"), eq(1L), isNull(), anyString());
    }

    @Test
    void create_withNonExistentPortfolio_throwsResourceNotFoundException() {
        when(portfolioRepository.findById(999L)).thenReturn(Optional.empty());
        projectRequest.setPortfolioId(999L);

        assertThrows(ResourceNotFoundException.class, () -> projectService.create(projectRequest));

        verify(portfolioRepository).findById(999L);
        verify(projectRepository, never()).save(any());
    }

    @Test
    void findAll_withDefaultParams_returnsPagedResponse() {
        Page<Project> projectPage = new PageImpl<>(List.of(testProject), PageRequest.of(0, 10), 1);
        when(projectRepository.findAll(any(Pageable.class))).thenReturn(projectPage);

        PagedResponse<ProjectResponse> response = projectService.findAll(0, 10, "id", "asc");

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(10, response.getSize());

        verify(projectRepository).findAll(any(Pageable.class));
    }

    @Test
    void findById_withExistingId_returnsProjectResponse() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        ProjectResponse response = projectService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Project", response.getName());

        verify(projectRepository).findById(1L);
    }

    @Test
    void findById_withNonExistentId_throwsResourceNotFoundException() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> projectService.findById(999L));

        verify(projectRepository).findById(999L);
    }

    @Test
    void update_withExistingId_returnsUpdatedResponse() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.update(1L, projectRequest);

        assertNotNull(response);
        assertEquals("Test Project", response.getName());

        verify(projectRepository).findById(1L);
        verify(projectRepository).save(any(Project.class));
        verify(auditService).log(eq("UPDATE"), eq("Project"), eq(1L), anyString(), anyString());
    }

    @Test
    void update_withNonExistentId_throwsResourceNotFoundException() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> projectService.update(999L, projectRequest));

        verify(projectRepository).findById(999L);
        verify(projectRepository, never()).save(any());
    }

    @Test
    void delete_withExistingId_removesProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        projectService.delete(1L);

        verify(projectRepository).findById(1L);
        verify(projectRepository).delete(testProject);
        verify(auditService).log(eq("DELETE"), eq("Project"), eq(1L), anyString(), isNull());
    }

    @Test
    void delete_withNonExistentId_throwsResourceNotFoundException() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> projectService.delete(999L));

        verify(projectRepository).findById(999L);
        verify(projectRepository, never()).delete(any());
    }

    @Test
    void filterByStatus_withActiveStatus_returnsFilteredProjects() {
        Page<Project> projectPage = new PageImpl<>(List.of(testProject), PageRequest.of(0, 10), 1);
        when(projectRepository.findByStatus(eq(ProjectStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(projectPage);

        PagedResponse<ProjectResponse> response = projectService.filterByStatus(ProjectStatus.ACTIVE, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());

        verify(projectRepository).findByStatus(eq(ProjectStatus.ACTIVE), any(Pageable.class));
    }

    @Test
    void search_withQuery_returnsMatchingProjects() {
        Page<Project> projectPage = new PageImpl<>(List.of(testProject), PageRequest.of(0, 10), 1);
        when(projectRepository.search(eq("Test"), any(Pageable.class))).thenReturn(projectPage);

        PagedResponse<ProjectResponse> response = projectService.search("Test", 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Test Project", response.getContent().get(0).getName());

        verify(projectRepository).search(eq("Test"), any(Pageable.class));
    }

    @Test
    void findByPortfolioId_withExistingPortfolio_returnsProjects() {
        Page<Project> projectPage = new PageImpl<>(List.of(testProject), PageRequest.of(0, 10), 1);
        when(projectRepository.findByPortfolioId(eq(1L), any(Pageable.class)))
                .thenReturn(projectPage);

        PagedResponse<ProjectResponse> response = projectService.findByPortfolioId(1L, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());

        verify(projectRepository).findByPortfolioId(eq(1L), any(Pageable.class));
    }
}
