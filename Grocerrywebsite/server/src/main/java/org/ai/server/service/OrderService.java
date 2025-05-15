package org.ai.server.service;

import jakarta.servlet.http.HttpServletRequest;
import org.ai.server.dto.Response;
import org.ai.server.model.OrderEntity;
import org.ai.server.request.PlaceOrderRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface OrderService {

    Response getUserOrders(Long userId);
    Response getAllOrders();
    Response placeOrderCOD(Long userId, PlaceOrderRequest placeOrderRequest);
    Response placeOrderStripe(Long userId, PlaceOrderRequest placeOrderRequest, HttpServletRequest request);
    Response verifyStripePayment(Map<String, String> payload);
    OrderEntity getOrderId(Long aLong);
    Response getTotalAmount();
   int getAllOrdersCount();
    Response getDeliverBoyOrders(Long id);
    int getPendingOrdersCount();
    int getCompletedOrdersCount();
    int todayOrdersCount();

}
