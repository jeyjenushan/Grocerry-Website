package org.ai.server.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.DeliveryNotificationRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.Response;
import org.ai.server.enumPackage.DeliveryNotification;
import org.ai.server.enumPackage.NotificationType;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.DeliverNotificationEntity;
import org.ai.server.model.NotificationEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.DeliveryNotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class DeliverNotificationServiceHandler implements DeliveryNotificationService {
    private final DeliveryNotificationRepository deliveryNotificationRepository;
    private final UserRepository userRepository;
;

    @Transactional
    public Response createNotification(Long userId, String message, DeliveryNotification type,Long deliverOrderId) {
    try{

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        DeliverNotificationEntity notification = new DeliverNotificationEntity();
        notification.setUser(user);
        notification.setDeliveryOrderId(deliverOrderId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notification=deliveryNotificationRepository.save(notification);

       return Response.success("Notification created");

    } catch (RuntimeException e) {
        return Response.error(e.getMessage(),404);
    } catch (Exception e) {
        return Response.error(e.getMessage(),500);
    }
    }


    @Transactional
    public Response markAsRead(Long notificationId) {
       try{
           DeliverNotificationEntity notification = deliveryNotificationRepository.findById(notificationId)
                   .orElseThrow(() -> new RuntimeException("Notification not found"));
           notification.setRead(true);
           notification=deliveryNotificationRepository.save(notification);
           return Response.success("Notification can be saved successfully").withDeliverNotificationDto(DtoConverter.convertDeliveryNotificationtoDeliveryNotificationDto(notification));

       } catch (RuntimeException e) {
           return Response.error(e.getMessage(),500);

       } catch (Exception e) {
           return Response.error("Notification can not be marked as read",500);
       }
    }

    public Response getUserNotifications(String email) {
        try {
            // 1. Find user by email
            UserEntity user = userRepository.findByEmail(email);
            if (user == null) {
                return Response.error("User not found with email: " + email, 404);
            }

            // 2. Get unread notifications for this user
            List<DeliverNotificationEntity> notifications = deliveryNotificationRepository
                    .findByUserIdAndIsReadFalseAndTypeOrderByCreatedAtDesc(user.getId(),DeliveryNotification.NEW_DELIVERY);

            // 3. Convert and return the response
            return Response.success("Delivery notifications retrieved successfully")
                    .withDeliverNotificationDtos(
                            DtoConverter.convertDeliveryNotificationListToDeliveryNotificationDtoList(notifications)
                    );

        } catch (Exception e) {
            return Response.error("Failed to get notifications: " + e.getMessage(), 500);
        }
    }




}
