package org.ai.server.Repository;

import org.ai.server.enumPackage.OrderStatus;
import org.ai.server.enumPackage.PaymentType;

import org.ai.server.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<OrderEntity,Long> {
    List<OrderEntity> findByUserId(Long userId);

    List<OrderEntity> findByIsPaid(boolean paid);

    List<OrderEntity>findByDeliveryBoyId(Long deliveryBoyId);

    List<OrderEntity> findByOrderStatus(OrderStatus orderStatus);

    // Total orders created today
    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = CURRENT_DATE")
    int countTodayOrders();


}
