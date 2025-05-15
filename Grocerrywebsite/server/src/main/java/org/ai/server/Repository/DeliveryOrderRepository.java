package org.ai.server.Repository;

import org.ai.server.enumPackage.DeliveryStatus;
import org.ai.server.model.DeliveryOrderEntity;
import org.ai.server.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrderEntity, Long> {
    List<DeliveryOrderEntity> findByDelivererIdAndStatus(Long delivererId, DeliveryStatus status);

    List<DeliveryOrderEntity> findByDelivererId(Long id);

    List<DeliveryOrderEntity> findByDelivererIdAndAcceptedAtBetween(Long id, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<DeliveryOrderEntity> findByDelivererIdAndStatusAndDeliveredAtBetween(Long id, DeliveryStatus deliveryStatus, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<DeliveryOrderEntity> findByStatus(DeliveryStatus deliveryStatus);

    List<DeliveryOrderEntity> findByStatusAndDeliveredAtBetween(DeliveryStatus deliveryStatus, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<DeliveryOrderEntity> findByDeliveredAtBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}