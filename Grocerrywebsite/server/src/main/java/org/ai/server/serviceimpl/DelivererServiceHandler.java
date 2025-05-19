package org.ai.server.serviceimpl;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.NotificationRepository;
import org.ai.server.Repository.PendingDelivererRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.PendingDeliverDto;
import org.ai.server.dto.Response;
import org.ai.server.enumPackage.ApprovalStatus;
import org.ai.server.enumPackage.NotificationType;
import org.ai.server.enumPackage.Role;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.NotificationEntity;
import org.ai.server.model.PendingDelivererEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.DelivererService;
import org.ai.server.service.EmailService;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@AllArgsConstructor
public class DelivererServiceHandler implements DelivererService {

    private static final String NOTIFICATION_NOT_FOUND = "Notification not found with ID: ";
    private static final String DATABASE_ERROR = "Database operation failed";
    private static final String EMAIL_ERROR = "Failed to send email notification";

    private final PendingDelivererRepository pendingDelivererRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Response approveDeliverer(Long id) {
        try {
            NotificationEntity notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException(NOTIFICATION_NOT_FOUND + id));

            String email = Objects.requireNonNull(notification.getRecipientEmail(), "Recipient email cannot be null");
            PendingDelivererEntity pendingDeliverer = pendingDelivererRepository.findByEmail(email);
            if (pendingDeliverer == null) {
                return Response.error("The pending deliverer is not found our store correct that",400);
            }


            validateApprovalPreconditions(pendingDeliverer, email);

            // Update deliverer status
            pendingDeliverer.setStatus(ApprovalStatus.APPROVED);
            pendingDelivererRepository.save(pendingDeliverer);

            // Update user role
            UserEntity deliverer = userRepository.findByEmail(email);

            notification.setRead(true);
            notification.setActionTaken(true);
            notification.setUser(deliverer);
            notification.setType(NotificationType.DELIVERER_APPROVED);
            notificationRepository.save(notification);


            if (deliverer.getRole() == Role.USER) {
                deliverer.setRole(Role.DELIVERER);
                userRepository.save(deliverer);
            }

            // Send approval email
            sendApprovalEmail(pendingDeliverer);

            return Response.success("Deliverer approved successfully")
                    .withUser(DtoConverter.convertUsertoUserDto(deliverer));

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage(), HttpStatus.BAD_REQUEST.value());
        } catch (DataAccessException e) {
            return Response.error(DATABASE_ERROR + ": " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (MessagingException e) {
            return Response.error(EMAIL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (Exception e) {
            return Response.error("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    @Transactional
    public Response rejectDeliverer(Long notificationId) {

        try {
            NotificationEntity notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new IllegalArgumentException(NOTIFICATION_NOT_FOUND + notificationId));

            String email = Objects.requireNonNull(notification.getRecipientEmail(), "Recipient email cannot be null");
            PendingDelivererEntity pendingDeliverer = pendingDelivererRepository.findByEmail(email);
            UserEntity deliverer = userRepository.findByEmail(email);
            if (pendingDeliverer == null) {
                return Response.error("The pending deliverer is not found our store correct that",400);
            }



            validateRejectionPreconditions(pendingDeliverer);

            // Update status to rejected
            pendingDeliverer.setStatus(ApprovalStatus.REJECTED);
            pendingDelivererRepository.save(pendingDeliverer);

            // Mark notification as read
            notification.setRead(true);
            notification.setActionTaken(true);
            notification.setType(NotificationType.DELIVERER_REJECTED);
            notification.setUser(deliverer);
            notificationRepository.save(notification);

            // Send rejection email
            sendRejectionEmail(pendingDeliverer);

            return Response.success("Deliverer rejected successfully");

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage(), HttpStatus.BAD_REQUEST.value());
        } catch (DataAccessException e) {
            return Response.error(DATABASE_ERROR + ": " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (MessagingException e) {
            return Response.error(EMAIL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (Exception e) {
            return Response.error("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public Response getPendingDeliver(String email) {
        try {
            Objects.requireNonNull(email, "Email cannot be null");
            PendingDelivererEntity pendingDeliverer = pendingDelivererRepository.findByEmail(email);


            return Response.success("Pending deliverer found successfully")
                    .withPendingDeliverDto(DtoConverter.convertPendingDeliverertoEntity(pendingDeliverer));

        } catch (IllegalArgumentException e) {
            return Response.error(e.getMessage(), HttpStatus.BAD_REQUEST.value());
        } catch (DataAccessException e) {
            return Response.error(DATABASE_ERROR + ": " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        } catch (Exception e) {
            return Response.error("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    private void validateApprovalPreconditions(PendingDelivererEntity pendingDeliverer, String email) {
        if (pendingDeliverer.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalArgumentException("This application has already been processed");
        }

        if (userRepository.existsByEmailAndRole(email, Role.DELIVERER)) {
            throw new IllegalArgumentException("This user is already registered as a deliverer");
        }
    }

    private void validateRejectionPreconditions(PendingDelivererEntity pendingDeliverer) {
        if (pendingDeliverer.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalArgumentException("This application has already been processed");
        }
    }

    private void sendApprovalEmail(PendingDelivererEntity pendingDeliverer) throws MessagingException {
        String subject = "Your Deliverer Application Has Been Approved";
        String content = String.format("Dear %s,%n%n" +
                "We are pleased to inform you that your application to become a deliverer has been approved.%n%n" +
                "You can now login to your account and start accepting delivery requests.%n%n" +
                "Best regards,%nThe Delivery Team", pendingDeliverer.getName());

        emailService.sendEmail(pendingDeliverer.getEmail(), subject, content);
    }

    private void sendRejectionEmail(PendingDelivererEntity pendingDeliverer) throws MessagingException {
        String subject = "Your Deliverer Application Update";
        String content = String.format("Dear %s,%n%n" +
                "We regret to inform you that your application to become a deliverer has been rejected.%n%n" +
                "Thank you for your interest in our platform.%n%n" +
                "Best regards,%nThe Delivery Team", pendingDeliverer.getName());

        emailService.sendEmail(pendingDeliverer.getEmail(), subject, content);
    }
}