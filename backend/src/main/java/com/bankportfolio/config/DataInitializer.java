package com.bankportfolio.config;

import com.bankportfolio.entity.*;
import com.bankportfolio.entity.enums.*;
import com.bankportfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
@Profile({"dev", "test"})
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final ProjectRiskRepository projectRiskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PortfolioRepository portfolioRepository,
                           ProjectRepository projectRepository,
                           ProjectRiskRepository projectRiskRepository,
                           ProjectUpdateRepository projectUpdateRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.projectRepository = projectRepository;
        this.projectRiskRepository = projectRiskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        Role adminRole = roleRepository.save(Role.builder().name(RoleName.ADMIN).description("System Administrator").build());
        Role managerRole = roleRepository.save(Role.builder().name(RoleName.MANAGER).description("Portfolio Manager").build());
        Role viewerRole = roleRepository.save(Role.builder().name(RoleName.VIEWER).description("Read-only Viewer").build());

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        Set<Role> managerRoles = new HashSet<>();
        managerRoles.add(managerRole);
        Set<Role> viewerRoles = new HashSet<>();
        viewerRoles.add(viewerRole);

        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@bankportfolio.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("John")
                .lastName("Administrator")
                .enabled(true)
                .roles(adminRoles)
                .build());

        User manager = userRepository.save(User.builder()
                .username("manager")
                .email("manager@bankportfolio.com")
                .password(passwordEncoder.encode("manager123"))
                .firstName("Sarah")
                .lastName("Mitchell")
                .enabled(true)
                .roles(managerRoles)
                .build());

        User viewer = userRepository.save(User.builder()
                .username("viewer")
                .email("viewer@bankportfolio.com")
                .password(passwordEncoder.encode("viewer123"))
                .firstName("David")
                .lastName("Chen")
                .enabled(true)
                .roles(viewerRoles)
                .build());

        Portfolio p1 = portfolioRepository.save(Portfolio.builder()
                .name("Digital Banking Transformation")
                .description("Enterprise-wide digital transformation initiative to modernize core banking systems and customer-facing applications")
                .owner("Sarah Mitchell")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("5000000.00"))
                .actualCost(new BigDecimal("2350000.00"))
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2025, 12, 31))
                .completionPercentage(new BigDecimal("47.00"))
                .build());

        Portfolio p2 = portfolioRepository.save(Portfolio.builder()
                .name("Regulatory Compliance & Risk Management")
                .description("Platform upgrade to meet Basel III, GDPR, and AML/KYC regulatory requirements across all business units")
                .owner("James Rodriguez")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.AMBER)
                .budget(new BigDecimal("3200000.00"))
                .actualCost(new BigDecimal("1890000.00"))
                .startDate(LocalDate.of(2024, 3, 1))
                .endDate(LocalDate.of(2025, 9, 30))
                .completionPercentage(new BigDecimal("59.00"))
                .build());

        Portfolio p3 = portfolioRepository.save(Portfolio.builder()
                .name("Mobile Banking Enhancement")
                .description("Next-generation mobile banking application with biometric authentication, AI-driven recommendations, and real-time notifications")
                .owner("Emily Watson")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.GREEN)
                .budget(new BigDecimal("2800000.00"))
                .actualCost(new BigDecimal("1120000.00"))
                .startDate(LocalDate.of(2024, 6, 1))
                .endDate(LocalDate.of(2025, 6, 30))
                .completionPercentage(new BigDecimal("40.00"))
                .build());

        Portfolio p4 = portfolioRepository.save(Portfolio.builder()
                .name("Data Analytics & AI Platform")
                .description("Build enterprise data lake and machine learning platform for fraud detection, credit scoring, and customer insights")
                .owner("Michael Park")
                .status(PortfolioStatus.ACTIVE)
                .health(PortfolioHealth.RED)
                .budget(new BigDecimal("4100000.00"))
                .actualCost(new BigDecimal("2750000.00"))
                .startDate(LocalDate.of(2024, 2, 1))
                .endDate(LocalDate.of(2025, 8, 31))
                .completionPercentage(new BigDecimal("67.00"))
                .build());

        Portfolio p5 = portfolioRepository.save(Portfolio.builder()
                .name("Payment Infrastructure Modernization")
                .description("Migration from legacy payment processing systems to cloud-native microservices architecture with real-time settlement")
                .owner("Sarah Mitchell")
                .status(PortfolioStatus.ON_HOLD)
                .health(PortfolioHealth.AMBER)
                .budget(new BigDecimal("3500000.00"))
                .actualCost(new BigDecimal("875000.00"))
                .startDate(LocalDate.of(2024, 4, 15))
                .endDate(LocalDate.of(2025, 10, 31))
                .completionPercentage(new BigDecimal("25.00"))
                .build());

        Project pr1 = projectRepository.save(Project.builder()
                .portfolio(p1)
                .name("Core Banking System Migration")
                .description("Migrate legacy COBOL-based core banking system to modern Java/Spring Boot microservices architecture")
                .projectManager("Sarah Mitchell")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.CRITICAL)
                .budget(new BigDecimal("1500000.00"))
                .actualCost(new BigDecimal("780000.00"))
                .completionPercentage(new BigDecimal("52.00"))
                .startDate(LocalDate.of(2024, 1, 15))
                .endDate(LocalDate.of(2025, 6, 30))
                .build());

        Project pr2 = projectRepository.save(Project.builder()
                .portfolio(p1)
                .name("Online Banking Portal Redesign")
                .description("Complete UI/UX overhaul of the web banking portal with responsive design and enhanced accessibility")
                .projectManager("Lisa Chang")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("800000.00"))
                .actualCost(new BigDecimal("320000.00"))
                .completionPercentage(new BigDecimal("40.00"))
                .startDate(LocalDate.of(2024, 3, 1))
                .endDate(LocalDate.of(2025, 3, 31))
                .build());

        Project pr3 = projectRepository.save(Project.builder()
                .portfolio(p1)
                .name("API Gateway Implementation")
                .description("Deploy centralized API gateway for secure, rate-limited access to internal banking services")
                .projectManager("Robert Kim")
                .status(ProjectStatus.COMPLETED)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("450000.00"))
                .actualCost(new BigDecimal("410000.00"))
                .completionPercentage(new BigDecimal("100.00"))
                .startDate(LocalDate.of(2024, 2, 1))
                .endDate(LocalDate.of(2024, 8, 31))
                .build());

        Project pr4 = projectRepository.save(Project.builder()
                .portfolio(p2)
                .name("AML Transaction Monitoring System")
                .description("Real-time anti-money laundering transaction monitoring using machine learning models and rule-based engine")
                .projectManager("James Rodriguez")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.AMBER)
                .priority(ProjectPriority.CRITICAL)
                .budget(new BigDecimal("1200000.00"))
                .actualCost(new BigDecimal("720000.00"))
                .completionPercentage(new BigDecimal("60.00"))
                .startDate(LocalDate.of(2024, 3, 1))
                .endDate(LocalDate.of(2025, 3, 31))
                .build());

        Project pr5 = projectRepository.save(Project.builder()
                .portfolio(p2)
                .name("GDPR Data Privacy Framework")
                .description("Implement comprehensive data privacy framework including consent management, data masking, and right-to-erasure capabilities")
                .projectManager("Anna Kowalski")
                .status(ProjectStatus.DELAYED)
                .health(ProjectHealth.RED)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("650000.00"))
                .actualCost(new BigDecimal("480000.00"))
                .completionPercentage(new BigDecimal("45.00"))
                .startDate(LocalDate.of(2024, 4, 1))
                .endDate(LocalDate.of(2025, 4, 30))
                .build());

        Project pr6 = projectRepository.save(Project.builder()
                .portfolio(p2)
                .name("Basel III Capital Reporting")
                .description("Automated regulatory capital reporting system for Basel III compliance with real-time dashboards")
                .projectManager("David Chen")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("500000.00"))
                .actualCost(new BigDecimal("290000.00"))
                .completionPercentage(new BigDecimal("58.00"))
                .startDate(LocalDate.of(2024, 5, 1))
                .endDate(LocalDate.of(2025, 5, 31))
                .build());

        Project pr7 = projectRepository.save(Project.builder()
                .portfolio(p3)
                .name("Biometric Authentication Module")
                .description("Fingerprint and facial recognition authentication for mobile banking with liveness detection")
                .projectManager("Emily Watson")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("700000.00"))
                .actualCost(new BigDecimal("280000.00"))
                .completionPercentage(new BigDecimal("40.00"))
                .startDate(LocalDate.of(2024, 6, 1))
                .endDate(LocalDate.of(2025, 2, 28))
                .build());

        Project pr8 = projectRepository.save(Project.builder()
                .portfolio(p3)
                .name("Push Notification Service")
                .description("Real-time push notification system for transaction alerts, security warnings, and promotional messages")
                .projectManager("Tom Harris")
                .status(ProjectStatus.PLANNED)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.MEDIUM)
                .budget(new BigDecimal("350000.00"))
                .actualCost(BigDecimal.ZERO)
                .completionPercentage(new BigDecimal("0.00"))
                .startDate(LocalDate.of(2025, 1, 1))
                .endDate(LocalDate.of(2025, 6, 30))
                .build());

        Project pr9 = projectRepository.save(Project.builder()
                .portfolio(p3)
                .name("Mobile Check Deposit")
                .description("Remote check deposit feature using image recognition and OCR for mobile banking app")
                .projectManager("Emily Watson")
                .status(ProjectStatus.COMPLETED)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.MEDIUM)
                .budget(new BigDecimal("250000.00"))
                .actualCost(new BigDecimal("230000.00"))
                .completionPercentage(new BigDecimal("100.00"))
                .startDate(LocalDate.of(2024, 7, 1))
                .endDate(LocalDate.of(2024, 12, 31))
                .build());

        Project pr10 = projectRepository.save(Project.builder()
                .portfolio(p4)
                .name("Enterprise Data Lake Construction")
                .description("Build scalable data lake on AWS S3 with Apache Spark for batch processing and real-time streaming via Kafka")
                .projectManager("Michael Park")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.RED)
                .priority(ProjectPriority.CRITICAL)
                .budget(new BigDecimal("1800000.00"))
                .actualCost(new BigDecimal("1350000.00"))
                .completionPercentage(new BigDecimal("75.00"))
                .startDate(LocalDate.of(2024, 2, 1))
                .endDate(LocalDate.of(2025, 4, 30))
                .build());

        Project pr11 = projectRepository.save(Project.builder()
                .portfolio(p4)
                .name("Fraud Detection ML Models")
                .description("Deploy real-time fraud detection models using gradient boosting and neural networks with sub-second response times")
                .projectManager("Priya Sharma")
                .status(ProjectStatus.DELAYED)
                .health(ProjectHealth.RED)
                .priority(ProjectPriority.CRITICAL)
                .budget(new BigDecimal("900000.00"))
                .actualCost(new BigDecimal("680000.00"))
                .completionPercentage(new BigDecimal("55.00"))
                .startDate(LocalDate.of(2024, 5, 1))
                .endDate(LocalDate.of(2025, 5, 31))
                .build());

        Project pr12 = projectRepository.save(Project.builder()
                .portfolio(p4)
                .name("Customer 360 Analytics Dashboard")
                .description("Unified customer analytics platform providing 360-degree view of customer interactions, products, and lifetime value")
                .projectManager("Michael Park")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.AMBER)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("700000.00"))
                .actualCost(new BigDecimal("380000.00"))
                .completionPercentage(new BigDecimal("54.00"))
                .startDate(LocalDate.of(2024, 6, 15))
                .endDate(LocalDate.of(2025, 6, 30))
                .build());

        Project pr13 = projectRepository.save(Project.builder()
                .portfolio(p5)
                .name("SWIFT gpi Integration")
                .description("Integrate SWIFT Global Payments Innovation for faster, more transparent international wire transfers")
                .projectManager("Sarah Mitchell")
                .status(ProjectStatus.ON_HOLD)
                .health(ProjectHealth.AMBER)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("900000.00"))
                .actualCost(new BigDecimal("225000.00"))
                .completionPercentage(new BigDecimal("25.00"))
                .startDate(LocalDate.of(2024, 4, 15))
                .endDate(LocalDate.of(2025, 7, 31))
                .build());

        Project pr14 = projectRepository.save(Project.builder()
                .portfolio(p5)
                .name("Real-Time Payment Settlement")
                .description("Implement real-time payment processing and settlement engine to replace batch processing legacy system")
                .projectManager("Kevin O'Brien")
                .status(ProjectStatus.ON_HOLD)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.MEDIUM)
                .budget(new BigDecimal("1100000.00"))
                .actualCost(new BigDecimal("330000.00"))
                .completionPercentage(new BigDecimal("30.00"))
                .startDate(LocalDate.of(2024, 5, 1))
                .endDate(LocalDate.of(2025, 9, 30))
                .build());

        Project pr15 = projectRepository.save(Project.builder()
                .portfolio(p5)
                .name("Payment Gateway Cloud Migration")
                .description("Migrate on-premise payment gateway infrastructure to AWS cloud for improved scalability and disaster recovery")
                .projectManager("Sarah Mitchell")
                .status(ProjectStatus.PLANNED)
                .health(ProjectHealth.GREEN)
                .priority(ProjectPriority.MEDIUM)
                .budget(new BigDecimal("800000.00"))
                .actualCost(BigDecimal.ZERO)
                .completionPercentage(new BigDecimal("0.00"))
                .startDate(LocalDate.of(2025, 2, 1))
                .endDate(LocalDate.of(2025, 10, 31))
                .build());

        Project pr16 = projectRepository.save(Project.builder()
                .portfolio(p1)
                .name("Customer Identity Verification System")
                .description("Digital KYC platform with document verification, video KYC, and risk-based authentication for onboarding")
                .projectManager("Lisa Chang")
                .status(ProjectStatus.ACTIVE)
                .health(ProjectHealth.AMBER)
                .priority(ProjectPriority.HIGH)
                .budget(new BigDecimal("500000.00"))
                .actualCost(new BigDecimal("210000.00"))
                .completionPercentage(new BigDecimal("42.00"))
                .startDate(LocalDate.of(2024, 8, 1))
                .endDate(LocalDate.of(2025, 5, 31))
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr1)
                .title("Legacy System Data Migration Risk")
                .description("Risk of data loss or corruption during migration of 30 years of transaction history from COBOL to modern database")
                .severity(RiskSeverity.HIGH)
                .status(RiskStatus.OPEN)
                .mitigation("Implement incremental migration with checksums and automated reconciliation at each stage")
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr5)
                .title("Regulatory Deadline Uncertainty")
                .description("Evolving GDPR enforcement guidelines may require additional scope changes and rework of implemented features")
                .severity(RiskSeverity.CRITICAL)
                .status(RiskStatus.OPEN)
                .mitigation("Engage external legal counsel for quarterly regulatory impact assessment")
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr10)
                .title("Cloud Cost Overrun")
                .description("Data lake storage and compute costs exceeding budget projections due to unexpected data volume growth")
                .severity(RiskSeverity.HIGH)
                .status(RiskStatus.OPEN)
                .mitigation("Implement data lifecycle policies and cost monitoring alerts with auto-scaling limits")
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr11)
                .title("Model Accuracy Below Threshold")
                .description("Fraud detection models currently achieving 87% accuracy against target of 95% precision rate")
                .severity(RiskSeverity.CRITICAL)
                .status(RiskStatus.OPEN)
                .mitigation("Expand training dataset, tune hyperparameters, and evaluate ensemble approaches")
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr4)
                .title("Third-Party Data Feed Dependency")
                .description("AML monitoring depends on external sanctions list feeds which have experienced 99.2% uptime vs 99.9% SLA")
                .severity(RiskSeverity.MEDIUM)
                .status(RiskStatus.MITIGATED)
                .mitigation("Implemented local cache and fallback feed from secondary provider")
                .build());

        projectRiskRepository.save(ProjectRisk.builder()
                .project(pr2)
                .title("Accessibility Compliance Gap")
                .description("Current WCAG 2.1 AA audit identified 23 accessibility violations that must be resolved before launch")
                .severity(RiskSeverity.MEDIUM)
                .status(RiskStatus.OPEN)
                .mitigation("Dedicated accessibility testing sprint with assistive technology validation")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr1)
                .title("Database Schema Migration Phase 2 Complete")
                .content("Successfully migrated all account and customer tables to new PostgreSQL schema. Automated validation tests passing at 99.8% accuracy. Next phase: transaction history migration.")
                .author("Sarah Mitchell")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr11)
                .title("Model Retraining Sprint Started")
                .content("Beginning two-week sprint to retrain fraud detection models with expanded dataset of 50M additional labeled transactions. Targeting 92% accuracy by end of sprint.")
                .author("Priya Sharma")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr4)
                .title("SAR Filing Automation Deployed")
                .content("Automated Suspicious Activity Report filing module deployed to production. Processing 2,500+ alerts daily with 40% reduction in false positives.")
                .author("James Rodriguez")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr7)
                .title("Biometric SDK Integration Complete")
                .content("Integrated Neurotechnology SDK for fingerprint and face recognition. Liveness detection achieving 99.5% spoof rejection rate. UAT scheduled for next week.")
                .author("Emily Watson")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr3)
                .title("Production Deployment Successful")
                .content("API Gateway v2.0 deployed to production environment. Handling 15,000 requests/second with p99 latency under 50ms. All rate limiting and authentication policies active.")
                .author("Robert Kim")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr5)
                .title("Scope Expansion Required")
                .content("New EU Digital Identity Regulation requires additional consent management features. Estimated 3-week delay. Impact assessment underway.")
                .author("Anna Kowalski")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr10)
                .title("Pipeline Performance Optimization")
                .content("Optimized Spark ETL pipelines reducing processing time from 4 hours to 45 minutes. Kafka streaming now handling 500K events/second.")
                .author("Michael Park")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr9)
                .title("Project Completed Successfully")
                .content("Mobile check deposit feature live in app stores. Processing 8,000 deposits daily with 99.7% auto-recognition rate. User adoption at 35% within first month.")
                .author("Emily Watson")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr2)
                .title("Design System Finalized")
                .content("Completed design system with 120+ components. Accessibility audit passed for all core banking flows. Responsive breakpoints validated across 15 device categories.")
                .author("Lisa Chang")
                .build());

        projectUpdateRepository.save(ProjectUpdate.builder()
                .project(pr12)
                .title("Data Integration Layer Complete")
                .content("Successfully integrated 8 data sources into Customer 360 platform. Real-time customer scoring now operational. Initial dashboard prototype reviewed by business stakeholders.")
                .author("Michael Park")
                .build());

        System.out.println("Seed data initialized successfully!");
        System.out.println("Created: 3 roles, 3 users, 5 portfolios, 16 projects, 6 risks, 10 updates");
    }
}
