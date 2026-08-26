package com.bankportfolio.service;

import com.bankportfolio.entity.AuditLog;
import com.bankportfolio.entity.User;
import com.bankportfolio.repository.AuditLogRepository;
import com.bankportfolio.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void log(String action, String entityName, Long entityId, String oldValues, String newValues) {
        Long userId = getCurrentUserId();

        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .oldValues(oldValues)
                .newValues(newValues)
                .build();

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAuditLogs(String entityName, Long entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByCreatedAtDesc(entityName, entityId);
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            if (!"anonymousUser".equals(username)) {
                Optional<User> user = userRepository.findByUsername(username);
                return user.map(User::getId).orElse(null);
            }
        }
        return null;
    }
}
