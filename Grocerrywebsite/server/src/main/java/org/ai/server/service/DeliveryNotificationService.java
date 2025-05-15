package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.enumPackage.DeliveryNotification;
import org.springframework.stereotype.Service;

@Service
public interface DeliveryNotificationService {
    Response createNotification(Long userId, String message, DeliveryNotification type,Long deliverOrderId);
    Response markAsRead(Long notificationId);
    Response getUserNotifications(String email);

}
