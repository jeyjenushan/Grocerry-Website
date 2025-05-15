package org.ai.server.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.server.enumPackage.NotificationType;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notifications")
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String message;
    private String recipientEmail;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    // For in-app notifications
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;
    private boolean actionTaken = false;
    private boolean isAdminNotification = false;
}
