package org.ai.server.Repository;

import org.ai.server.enumPackage.DeliveryNotification;
import org.ai.server.model.DeliverNotificationEntity;
import org.ai.server.model.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryNotificationRepository extends JpaRepository<DeliverNotificationEntity,Long> {


  List<DeliverNotificationEntity>findByDeliveryOrderId(Long deliveryOrderId);

    List<DeliverNotificationEntity> findByUserIdAndIsReadFalseAndTypeOrderByCreatedAtDesc(Long userId,DeliveryNotification type);

  DeliverNotificationEntity findByUserIdAndDeliveryOrderId(Long delivererId,Long deliveryOrderId);

  List<DeliverNotificationEntity> findAllByDeliveryOrderId(Long deliveryOrderId);

  List<DeliverNotificationEntity> findByUserId(Long id);

  ;
}
