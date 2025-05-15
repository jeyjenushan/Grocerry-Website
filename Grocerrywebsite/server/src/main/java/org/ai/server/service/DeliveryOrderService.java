package org.ai.server.service;

import org.ai.server.dto.Response;
import org.springframework.stereotype.Service;

@Service
public interface DeliveryOrderService {
    Response assignOrderToDeliverer(Long orderId);
    Response acceptDelivery(Long deliveryOrderId, Long delivererId);
    Response rejectDelivery(Long deliveryOrderId,Long delivererId);
    Response completeDelivery(Long deliveryOrderId, String verificationCode,String email);
    Response getEarnings(String email);
    Response getDeliveryBoyStat(String email);
    int getCancelledOrdersCount();
    int completedDelliveriesOrdersCountToday();
    int rejectedDeliveriesOrdersCountToday();
    int acceptedDeliveriesOrdersCountToday();
    int acceptedOrdersCount();



}
