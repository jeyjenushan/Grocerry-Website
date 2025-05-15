package org.ai.server.Repository;

import org.ai.server.model.DeliveryAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAttemptRepository extends JpaRepository<DeliveryAttemptEntity,Long> {
    Optional<DeliveryAttemptEntity> findByDeliveryOrderId(Long deliveryOrderId);
}
