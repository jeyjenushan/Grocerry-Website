package org.ai.server.service;

import jakarta.mail.MessagingException;
import org.ai.server.dto.Response;

import org.ai.server.model.PendingDelivererEntity;
import org.springframework.stereotype.Service;



@Service
public interface NotificationService {

     Response notifyAdminOfPendingDeliverer(PendingDelivererEntity deliverer) throws MessagingException;
   Response getAdminNotifications();
    Response markAsRead(Long notificationId);

    Response markActionTaken(Long notificationId);

    Response getRejectedUser(String email);
}
