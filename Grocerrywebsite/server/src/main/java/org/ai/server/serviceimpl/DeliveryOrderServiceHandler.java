package org.ai.server.serviceimpl;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.*;
import org.ai.server.dto.DeliveryBoyOrderStatsDto;
import org.ai.server.dto.Response;
import org.ai.server.enumPackage.*;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.*;
import org.ai.server.service.DeliveryOrderService;
import org.ai.server.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DeliveryOrderServiceHandler implements DeliveryOrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryOrderRepository deliveryOrderRepository;
   private final DeliverNotificationServiceHandler deliverNotificationServiceHandler;
   private final DeliveryNotificationRepository deliveryNotificationRepository;
    private final EmailService emailService;
    private final DeliveryAttemptRepository deliveryAttemptRepository;
    private final PendingDelivererRepository pendingDelivererRepository;


    @Transactional
    public Response assignOrderToDeliverer(Long orderId){

        try{
            OrderEntity order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            DeliveryOrderEntity deliveryOrder = new DeliveryOrderEntity();
            deliveryOrder.setOrder(order);
            deliveryOrder.setStatus(DeliveryStatus.PENDING);
            deliveryOrder.setAssignedAt(LocalDateTime.now());



            deliveryOrder=deliveryOrderRepository.save(deliveryOrder);
            // Notify only deliverers via app notifications
            notifyAvailableDeliverers(deliveryOrder.getId());
            return Response.success("The order has been assigned to the deliverer.");
        } catch (RuntimeException e) {
           return Response.error(e.getMessage(),400);
        } catch (Exception e) {
            return Response.error("The order can not be assigned to the deliverer ",400);
        }





    }


    @Transactional
    public Response acceptDelivery(Long deliveryOrderId, Long delivererId) {
        try {
            DeliveryOrderEntity deliveryOrder = deliveryOrderRepository.findById(deliveryOrderId)
                    .orElseThrow(() -> new RuntimeException("Delivery order not found"));

            // Check if delivery is already accepted
            if (deliveryOrder.getStatus() == DeliveryStatus.PROCESSING) {
                return Response.error("This delivery has already been accepted", 400);
            }
            // Get all notifications for this delivery order
            List<DeliverNotificationEntity> notificationEntityList = deliveryNotificationRepository.findByDeliveryOrderId(deliveryOrderId);

            // Update all notifications:
            // - Set current deliverer's notification to ACCEPTED
            // - Set all others to NOT_ACCEPTED
            for (DeliverNotificationEntity notification : notificationEntityList) {
                if (notification.getUser().getId().equals(delivererId)) {
                    notification.setType(DeliveryNotification.DELIVERY_ACCEPTED);
                } else {
                    notification.setType(DeliveryNotification.DELIVERY_REJECTED);
                }
                notification.setRead(true);

            }
            notificationEntityList=deliveryNotificationRepository.saveAll(notificationEntityList);






            UserEntity deliverer = userRepository.findById(delivererId)
                    .orElseThrow(() -> new RuntimeException("Deliverer not found"));

            deliveryOrder.setDeliverer(deliverer);
            deliveryOrder.setAcceptedAt(LocalDateTime.now());
            // Generate verification code
            String verificationCode = String.format("%06d", new Random().nextInt(999999));
            deliveryOrder.setVerificationCode(verificationCode);
            deliveryOrder.setStatus(DeliveryStatus.PROCESSING);
            deliveryOrder = deliveryOrderRepository.save(deliveryOrder);

            // Update main order status
            OrderEntity order = deliveryOrder.getOrder();
            order.setOrderStatus(OrderStatus.PROCESSING);
            order.setDeliveryBoy(deliverer);
            orderRepository.save(order);

            // Send email to customer
            UserEntity customer = userRepository.findById(order.getUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            emailService.sendEmail(
                    customer.getEmail(),
                    "Your Order Has Been Accepted",
                    "Your order #" + order.getId() + " has been accepted by a deliverer and is being processed." +
                            " and your verification code is " + verificationCode +
                            " and your deliverer name is " + deliverer.getName()
            );

            return Response.success("Delivery accepted");
        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 400);
        } catch (Exception e) {
            return Response.error("The order cannot be accepted", 400);
        }
    }


    @Transactional
    public Response rejectDelivery(Long deliveryOrderId, Long delivererId) {
        try {

            DeliveryOrderEntity deliveryOrder = deliveryOrderRepository.findById(deliveryOrderId)
                    .orElseThrow(() -> new RuntimeException("Delivery order not found"));


            DeliverNotificationEntity notification = deliveryNotificationRepository.findByUserIdAndDeliveryOrderId(delivererId, deliveryOrderId);
            notification.setType(DeliveryNotification.DELIVERY_REJECTED);
            notification.setRead(true);
            deliveryNotificationRepository.save(notification);

            // Check if all deliverers have rejected this order
            List<DeliverNotificationEntity> allNotifications = deliveryNotificationRepository.findAllByDeliveryOrderId(deliveryOrderId);
            boolean allRejected = allNotifications.stream()
                    .allMatch(n -> n.getType() == DeliveryNotification.DELIVERY_REJECTED);

            // Only reassign if all deliverers have rejected
            if (allRejected) {
                deliveryOrder.setStatus(DeliveryStatus.PENDING);
                deliveryOrder.getOrder().setOrderStatus(OrderStatus.PENDING);
                deliveryOrderRepository.save(deliveryOrder);

                assignOrderToDeliverer(deliveryOrderId);
                return Response.success("All deliverers rejected. Delivery reassigned to other deliverers");
            } else {
                return Response.success("Delivery rejection recorded. Waiting for other deliverers' responses");
            }
        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 400);
        } catch (Exception e) {
            return Response.error("The order cannot be rejected", 400);
        }
    }

    private void notifyAvailableDeliverers(Long orderId) {
        // Get all available deliverers
        List<UserEntity> deliverers = userRepository.findByRole(Role.DELIVERER);

        for (UserEntity deliverer : deliverers) {
          deliverNotificationServiceHandler.createNotification(
                    deliverer.getId(),
                    "New delivery order #" + orderId + " available",
                  DeliveryNotification.NEW_DELIVERY,
                    orderId
            );

        }

    }

    @Transactional
    public Response completeDelivery(Long deliveryOrderId, String verificationCode, String email) {
        try {
            DeliveryOrderEntity deliveryOrder = deliveryOrderRepository.findById(deliveryOrderId)
                    .orElseThrow(() -> new RuntimeException("Delivery order not found"));

            UserEntity deliverer = userRepository.findByEmail(email);

            // Get or create attempt tracking
            DeliveryOrderEntity finalDeliveryOrder = deliveryOrder;
            DeliveryAttemptEntity attempt = deliveryAttemptRepository.findByDeliveryOrderId(deliveryOrderId)
                    .orElseGet(() -> {
                        DeliveryAttemptEntity newAttempt = new DeliveryAttemptEntity();
                        newAttempt.setDeliveryOrder(finalDeliveryOrder);
                        newAttempt.setAttempts(0);
                        return deliveryAttemptRepository.save(newAttempt);
                    });



            if (!deliveryOrder.getVerificationCode().equals(verificationCode)) {
                // Increment failed attempts
                attempt.setAttempts(attempt.getAttempts() + 1);
                deliveryAttemptRepository.save(attempt);

                if (attempt.getAttempts() >= 3) {
                    // After 3 failed attempts, cancel the order
                    deliveryOrder.setStatus(DeliveryStatus.CANCELLED);
                    deliveryOrder = deliveryOrderRepository.save(deliveryOrder);

                    OrderEntity order = deliveryOrder.getOrder();
                    order.setOrderStatus(OrderStatus.PENDING);
                    order = orderRepository.save(order);

                    List<DeliverNotificationEntity> deliveryNotifications = deliveryNotificationRepository.findByDeliveryOrderId(deliveryOrderId);
                    for (DeliverNotificationEntity notification : deliveryNotifications) {
                        notification.setType(DeliveryNotification.DELIVERY_REJECTED);
                    }
                    deliveryNotificationRepository.saveAll(deliveryNotifications);

                    // Send cancellation email
                    UserEntity user = userRepository.findById(order.getUserId())
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    emailService.sendEmail(
                            user.getEmail(),
                            "Order Cancelled - Too Many Failed Attempts",
                            "Your order #" + order.getId() + " has been cancelled due to too many failed verification attempts"
                    );

                    return Response.error("Order cancelled due to too many failed verification attempts", 400);
                } else {
                    // For attempts < 3, just throw error
                    throw new RuntimeException("Invalid verification code. Attempts remaining: " + (3 - attempt.getAttempts()));
                }
            }

            // If code is correct, proceed with delivery completion
            DeliverNotificationEntity notification=deliveryNotificationRepository.findByUserIdAndDeliveryOrderId(deliverer.getId(),deliveryOrderId);

                notification.setType(DeliveryNotification.DELIVERY_COMPLETED);

            deliveryNotificationRepository.save(notification);

            deliveryOrder.setStatus(DeliveryStatus.DELIVERED);
            deliveryOrder.setDeliveredAt(LocalDateTime.now());
            deliveryOrder.setDeliverer(deliverer);
            deliveryOrder = deliveryOrderRepository.save(deliveryOrder);

            // Update main order status
            OrderEntity order = deliveryOrder.getOrder();
            UserEntity user = userRepository.findById(order.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setOrderStatus(OrderStatus.COMPLETED);
            order.setPaid(true);
            orderRepository.save(order);

            emailService.sendEmail(
                    user.getEmail(),
                    "Your Order Has Been Completed",
                    "Your order #" + order.getId() + " has been completed"
            );

            // Clear attempt tracking on success
            deliveryAttemptRepository.delete(attempt);

            return Response.success("Delivery completed successfully");

        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 400);
        } catch (Exception e) {
            return Response.error("The order cannot be completed", 400);
        }
    }

    @Override
    public Response getEarnings(String email) {
        UserEntity user = userRepository.findByEmail(email);
        List<DeliveryOrderEntity> deliveryOrderEntityList=deliveryOrderRepository.findByDelivererIdAndStatus(user.getId(),DeliveryStatus.DELIVERED);
        if(deliveryOrderEntityList.isEmpty()){
            return Response.success("No delivery order found");
        }
        int earnings=0;
        for(DeliveryOrderEntity deliveryOrderEntity:deliveryOrderEntityList){
           if( deliveryOrderEntity.getOrder().getPaymentType().equals(PaymentType.COD)){
              earnings+= deliveryOrderEntity.getOrder().getAmount();

           }

        }
        return Response.success("Earnings get successfully").withUser(DtoConverter.convertUsertoUserDto(user)).withAmount(earnings);
    }

    @Override
    public Response getDeliveryBoyStat(String email) {
        try {
            UserEntity deliverer = userRepository.findByEmail(email);
            if (deliverer == null) {
                return  Response.error("Delivery boy not found", 400);
            }

            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

            // Get all orders assigned to this delivery boy
            List<DeliveryOrderEntity> allOrders = deliveryOrderRepository.findByDelivererId(deliverer.getId());

            // Get completed orders (DELIVERED status)
            List<DeliveryOrderEntity> completedOrders = deliveryOrderRepository.findByDelivererIdAndStatus(
                    deliverer.getId(), DeliveryStatus.DELIVERED);

            // Get orders accepted today
            List<DeliveryOrderEntity> todayAcceptedOrders = deliveryOrderRepository.findByDelivererIdAndAcceptedAtBetween(
                    deliverer.getId(), startOfDay, endOfDay);

            // Get orders completed today
            List<DeliveryOrderEntity> todayCompletedOrders = deliveryOrderRepository.findByDelivererIdAndStatusAndDeliveredAtBetween(
                    deliverer.getId(), DeliveryStatus.DELIVERED, startOfDay, endOfDay);

            // Get pending orders (ACCEPTED or PICKED status)
            List<DeliveryOrderEntity> pendingOrders = allOrders.stream()
                    .filter(order -> order.getStatus() == DeliveryStatus.PENDING)
                    .collect(Collectors.toList());

            // Calculate statistics
            int totalAccepted = allOrders.size();
            int totalCompleted = completedOrders.size();
            int todayAccepted = todayAcceptedOrders.size();
            int todayCompleted = todayCompletedOrders.size();
            int totalPending = pendingOrders.size();


            LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1); // Monday
            LocalDate endOfWeek = startOfWeek.plusDays(6); // Sunday

            // Initialize arrays for each day of the week
            int[] weeklyAccepted = new int[7];
            int[] weeklyCompleted = new int[7];

            List<DeliveryOrderEntity> weeklyOrders = deliveryOrderRepository.findByDelivererIdAndAcceptedAtBetween(
                    deliverer.getId(),
                    startOfWeek.atStartOfDay(),
                    endOfWeek.atTime(LocalTime.MAX));

            // Populate weekly data
            for (DeliveryOrderEntity order : weeklyOrders) {
                LocalDate orderDate = order.getAcceptedAt().toLocalDate();
                int dayOfWeek = orderDate.getDayOfWeek().getValue() - 1; // 0=Monday to 6=Sunday

                // Count accepted orders
                weeklyAccepted[dayOfWeek]++;

                // Count completed orders if delivered
                if (order.getStatus() == DeliveryStatus.DELIVERED && order.getDeliveredAt() != null) {
                    weeklyCompleted[dayOfWeek]++;
                }
            }


            // Create response object
            DeliveryBoyOrderStatsEntity stats = new DeliveryBoyOrderStatsEntity();
            stats.setAcceptedDeliveries(totalAccepted);
            stats.setCompletedDeliveries(totalCompleted);
            stats.setTodayAcceptedDeliveries(todayAccepted);
            stats.setTodayCompletedDeliveries(todayCompleted);
            stats.setPendingDeliveries(totalPending);


            // Calculate completion percentage (avoid division by zero)
            double completionPercentage = totalAccepted > 0 ?
                    ((double) totalCompleted / totalAccepted) * 100 : 0;
            stats.setCompletionPercentage(Math.round(completionPercentage));

            DeliveryBoyOrderStatsDto deliveryBoyOrderStatsDto = DtoConverter.convertDEliveryBoyOrderStatsDto(stats);
            deliveryBoyOrderStatsDto.setWeeklyAcceptedOrders(weeklyAccepted);
            deliveryBoyOrderStatsDto.setWeeklyCompletedOrders(weeklyCompleted);

            return  Response.success("Statistics fetched successfully").withDeliveryBoyOrderStatsDto(deliveryBoyOrderStatsDto);
        } catch (Exception e) {
            return  Response.error("Error fetching statistics: " + e.getMessage(), 400);
        }
    }

    @Override
    public int getCancelledOrdersCount() {
        List<DeliveryOrderEntity>deliveryOrders =deliveryOrderRepository.findByStatus(DeliveryStatus.CANCELLED);
        return deliveryOrders.size();
    }

    @Override
    public int completedDelliveriesOrdersCountToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        List<DeliveryOrderEntity> todayCompletedOrders = deliveryOrderRepository.findByStatusAndDeliveredAtBetween(DeliveryStatus.DELIVERED, startOfDay, endOfDay);
         return todayCompletedOrders.size();
    }

    @Override
    public int rejectedDeliveriesOrdersCountToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        List<DeliveryOrderEntity> todayCompletedOrders = deliveryOrderRepository.findByStatusAndDeliveredAtBetween(DeliveryStatus.CANCELLED, startOfDay, endOfDay);
        return todayCompletedOrders.size();
    }

    @Override
    public int acceptedDeliveriesOrdersCountToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        List<DeliveryOrderEntity> todayCompletedOrders = deliveryOrderRepository.findByDeliveredAtBetween( startOfDay, endOfDay);
        return todayCompletedOrders.size();
    }

    @Override
    public int acceptedOrdersCount() {
        return deliveryOrderRepository.findAll().size();
    }


}
