package org.ai.server.serviceimpl;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.NotificationRepository;
import org.ai.server.Repository.PendingDelivererRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.NotificationDto;
import org.ai.server.dto.PendingDeliverDto;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.enumPackage.NotificationType;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.DeliverNotificationEntity;
import org.ai.server.model.NotificationEntity;
import org.ai.server.model.PendingDelivererEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.EmailService;
import org.ai.server.service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class NotificationServiceHandler implements NotificationService {
    private final NotificationRepository notificationRepository;

    private final PendingDelivererRepository pendingDelivererRepository;

    private final UserRepository userRepository;

    public Response notifyAdminOfPendingDeliverer(PendingDelivererEntity deliverer) throws MessagingException {
        try {
            // Check if there's already a pending notification for this deliverer
            List<NotificationEntity> existingNotifications = notificationRepository
                    .findByRecipientEmailAndTypeAndIsAdminNotificationTrue(deliverer.getEmail(),
                            NotificationType.DELIVERER_APPROVAL_REQUEST);

            // If there's an existing unread notification, return it
            if (!existingNotifications.isEmpty() &&
                    existingNotifications.stream().anyMatch(n -> !n.isRead())) {
                NotificationEntity existing = existingNotifications.get(0);
                return Response.success("Notification already exists")
                        .withNotification(DtoConverter.convertNotificationtoNotificationDto(existing));
            }

            NotificationEntity notification = new NotificationEntity();
            notification.setType(NotificationType.DELIVERER_APPROVAL_REQUEST);
            notification.setMessage("New deliverer application from: " + deliverer.getEmail());
            notification.setAdminNotification(true);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRecipientEmail(deliverer.getEmail());
            notification.setRead(false);
            notification.setActionTaken(false); // New field to track if action was taken

            notification = notificationRepository.save(notification);
            return Response.success("Notification saved")
                    .withNotification(DtoConverter.convertNotificationtoNotificationDto(notification));
        } catch (Exception e) {
            return Response.error("Problem saving notification: " + e.getMessage(), 400);
        }
    }

    public Response getAdminNotifications() {
        try {
            // Get all unread notifications OR read but no action taken within 24 hours
            List<NotificationEntity> allAdminNotifications = notificationRepository
                    .findByIsAdminNotificationTrue();

            List<NotificationEntity> filteredNotifications = allAdminNotifications.stream()
                    .filter(n -> !n.isRead() ||
                            (n.isRead() && !n.isActionTaken() &&
                                    ChronoUnit.HOURS.between(n.getCreatedAt(), LocalDateTime.now()) < 24))
                    .collect(Collectors.toList());

            List<NotificationDto> notificationDtoList = DtoConverter
                    .convertNotificationListToNotificationDtoList(filteredNotifications);

            return Response.success("Notifications fetched successfully")
                    .withNotifications(notificationDtoList);
        } catch (Exception e) {
            return Response.error("Problem fetching notifications: " + e.getMessage(), 400);
        }
    }

    public Response markAsRead(Long notificationId) {
        try {
            NotificationEntity notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));

            String email = notification.getRecipientEmail();
            if (email == null) {
                return Response.error("Notification has no associated email", 400);
            }

            // Check if there's a pending deliverer for this notification
            PendingDelivererEntity pendingDeliverer = pendingDelivererRepository.findByEmail(email);
            if (pendingDeliverer == null) {
                return Response.error("No pending deliverer found for this notification", 404);
            }

            // Mark as read but don't set actionTaken yet
            notification.setRead(true);
            notification = notificationRepository.save(notification);

            NotificationDto notificationDto = DtoConverter.convertNotificationtoNotificationDto(notification);
            PendingDeliverDto pendingDeliverDto = DtoConverter.convertPendingDeliverertoEntity(pendingDeliverer);

            return Response.success("Notification marked as read")
                    .withNotification(notificationDto)
                    .withPendingDeliverDto(pendingDeliverDto);
        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 400);
        } catch (Exception e) {
            return Response.error("Problem marking notification: " + e.getMessage(), 400);
        }
    }

    public Response markActionTaken(Long notificationId) {
        try {
            NotificationEntity notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));

            String email = notification.getRecipientEmail();
            if (email == null) {
                return Response.error("Notification has no associated email", 400);
            }

            // Check if there's a pending deliverer for this notification
            PendingDelivererEntity pendingDeliverer = pendingDelivererRepository.findByEmail(email);
            if (pendingDeliverer == null) {
                return Response.error("No pending deliverer found for this notification", 404);
            }

            // Mark as read but don't set actionTaken yet
            notification.setRead(true);
            notification.setActionTaken(true);
            notification = notificationRepository.save(notification);

            NotificationDto notificationDto = DtoConverter.convertNotificationtoNotificationDto(notification);
            PendingDeliverDto pendingDeliverDto = DtoConverter.convertPendingDeliverertoEntity(pendingDeliverer);

            return Response.success("Notification marked as read")
                    .withNotification(notificationDto)
                    .withPendingDeliverDto(pendingDeliverDto);
        } catch (Exception e) {
            return Response.error("Problem updating notification action status: " + e.getMessage(), 400);
        }
    }

    public Response getRejectedUser(String email) {
        // Validate email input
        if (email == null || email.trim().isEmpty()) {
            return Response.error("Email cannot be empty", 400);
        }

        try {
            UserEntity user = userRepository.findByEmail(email.trim());
            if (user == null) {
                return Response.error("User not found with email: " + email, 404);
            }


            // Find all notifications for the user (not just one)
            List<NotificationEntity> notifications = notificationRepository.findByUserId(user.getId());
            System.out.println(notifications);

            if (notifications == null || notifications.isEmpty()) {
                return Response.success("No notifications found for this user").withRejected(false);
            }

            // Check if any notification is of type DELIVERER_REJECTED
            boolean isRejected = notifications.stream()
                    .anyMatch(notification ->
                            notification != null &&
                                    notification.getType().equals(NotificationType.DELIVERER_REJECTED));


            if (isRejected) {
                return Response.success("The user has rejected a delivery notification").withRejected(true);
            } else {
                return Response.success("The user has not rejected any delivery notifications").withRejected(false);
            }

        } catch (Exception e) {
            // Log the exception here
            return Response.error("An error occurred while processing the request", 500);
        }
    }
}