package org.ai.server.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.server.enumPackage.NotificationType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {

    private Long id;

    private NotificationType type;

    private String message;
    private String recipientEmail;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    private UserDto user;

    private boolean isAdminNotification = false;
    private boolean actionTaken = false;
}
