package org.ai.server.serviceimpl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import org.ai.server.Repository.*;
import org.ai.server.dto.OrderDto;
import org.ai.server.dto.Response;
import org.ai.server.enumPackage.OrderStatus;
import org.ai.server.enumPackage.PaymentType;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.*;
import org.ai.server.request.OrderItemRequest;
import org.ai.server.request.PlaceOrderRequest;
import org.ai.server.request.ProductData;
import org.ai.server.service.OrderService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

import java.util.stream.Collectors;

@Service

public class OrderServiceHandler implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderServiceHandler(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, AddressRepository addressRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Override
    public Response getUserOrders(Long userId) {
        try{
            if(userId==null){
                return Response.error("Please provide your user information correctly",400);
            }

            UserEntity user=userRepository.findById(userId).orElseThrow(()->new RuntimeException("The user is not Found"));
            List<OrderEntity> orders = orderRepository.findByUserId(
                userId);
            if(orders.isEmpty()){
                return Response.success("No Orders Found").withOrders(DtoConverter.convertOrderListToOrderDto(orders));
            }
            else{
                return Response.success("Orders Found").withOrders(DtoConverter.convertOrderListToOrderDto(orders));

            }

        } catch (RuntimeException e) {
            return Response.error(e.getMessage(),400);

        }catch (Exception e) {
            return Response.error("We're having trouble loading your orders. Please try again later.", 500);
        }

    }

    @Override
    public Response getAllOrders() {
        try{
            List<OrderEntity> orders = orderRepository.findAll();
            if(orders.isEmpty()){
                return Response.success("No Orders Found").withOrders(Collections.emptyList());
            }
            return Response.success("Orders Found").withOrders(DtoConverter.convertOrderListToOrderDto(orders));
        }catch (Exception e) {
            return Response.error("We're having trouble retrieving orders. Please try again later.", 500);
        }

    }


    @Override
    public Response placeOrderCOD(Long userId, PlaceOrderRequest placeOrderRequest) {
    try{
        if (userId == null) {
            return Response.error("Please provide your user information", 400);
        }

        if (placeOrderRequest.getAddress() == null) {
            return Response.error("Please provide a delivery address", 400);
        }

        if (placeOrderRequest.getItems() == null || placeOrderRequest.getItems().isEmpty()) {
            return Response.error("Your cart is empty. Please add items before placing an order", 400);
        }
        double amount = calculateOrderAmount(placeOrderRequest.getItems());
        amount += amount * 0.02; // Add 2% tax

        OrderEntity order=new OrderEntity();
        order.setOrderStatus(OrderStatus.PENDING);
        order.setUserId(userId);
        order.setPaymentType(PaymentType.COD);
        order.setAmount(amount);
        order.setItems(mapToOrderItems(placeOrderRequest.getItems()));
        order.setAddress(placeOrderRequest.getAddress());
        order.setPaid(false);
        OrderEntity savedOrder = orderRepository.save(order);
        return Response.success("Your order has been placed successfully! You'll pay when your items arrive")
                .withOrder(DtoConverter.convertOrdertoOrderDto(savedOrder));




    } catch (Exception e) {
        return Response.error("We couldn't process your order right now. Please try again.", 500);
    }

    }

    private double calculateOrderAmount(List<OrderItemRequest> items) {
        return items.stream()
                .mapToDouble(item -> {
                    ProductEntity product = productRepository.findById(item.getProduct().getId())
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProduct().getId()));
                    return product.getOfferPrice() * item.getQuantity();
                })
                .sum();
    }

    private List<OrderItemEntity> mapToOrderItems(List<OrderItemRequest> itemRequests) {
        return itemRequests.stream()
                .map(item -> {
                    OrderItemEntity orderItem = new OrderItemEntity();
                    orderItem.setProduct(productRepository.findById(item.getProduct().getId())
                            .orElseThrow(() -> new RuntimeException("Product not found")));
                    orderItem.setQuantity(item.getQuantity());
                    orderItem=orderItemRepository.save(orderItem);
                    return orderItem;
                })
                .collect(Collectors.toList());
    }




    @Override
    public OrderEntity getOrderId(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }






    @Transactional
    @Override
    public Response placeOrderStripe(Long userId, PlaceOrderRequest placeOrderRequest,HttpServletRequest request
                                   ){


        try{
            if (userId == null || userId <= 0) {
                return Response.error("Invalid user ID. Please log in again.", 400);
            }

            if (placeOrderRequest == null) {
                return Response.error("Order information is missing. Please provide order details.", 400);
            }


            List<OrderItemRequest> items = placeOrderRequest.getItems();
            if (items == null || items.isEmpty()) {
                return Response.error("Your cart is empty. Please add items before placing an order.", 400);
            }


            if (placeOrderRequest.getAddress() == null) {
                return Response.error("Shipping address is required. Please provide a delivery address.", 400);
            }



            Stripe.apiKey = stripeApiKey;

            // Save address explicitly
            AddressEntity address = placeOrderRequest.getAddress();
            address = addressRepository.save(address);

            // Calculate amount and prepare product data
            List<ProductData> productDataList = new ArrayList<>();
            double amount = 0.0;


            for (OrderItemRequest item : items) {

                if (item == null || item.getProduct() == null) {
                    return Response.error("Invalid product in your order. Please refresh your cart.", 400);
                }

                ProductEntity product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                if (item.getQuantity() <= 0) {
                    return Response.error("Invalid quantity for product: " + product.getName(), 400);
                }


                productDataList.add(new ProductData(
                        product.getName(),
                        product.getOfferPrice(),
                        item.getQuantity()
                ));

                amount += product.getOfferPrice() * item.getQuantity();
            }

            // Add tax (2%)
            amount += Math.floor(amount * 0.02);

            // Create order
            OrderEntity order = new OrderEntity();
            order.setUserId(userId);
            order.setItems(mapToOrderItems(placeOrderRequest.getItems()));

            order.setAmount(amount);
            order.setAddress(address);

            order.setPaymentType(PaymentType.STRIPE);
            order.setPaid(false);


            order = orderRepository.save(order);





            // Prepare line items for Stripe
            List<SessionCreateParams.LineItem> lineItems = productDataList.stream()
                    .map(item -> {
                        long unitAmount = (long) (Math.floor(item.getPrice() + item.getPrice() * 0.02) * 100);
                        return SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(item.getName())
                                                                .build()
                                                )
                                                .setUnitAmount(unitAmount)
                                                .build()
                                )
                                .setQuantity((long) item.getQuantity())
                                .build();
                    })
                    .collect(Collectors.toList());



            // Create Stripe session
            SessionCreateParams params = SessionCreateParams.builder()
                    .addAllLineItem(lineItems)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173" + "/loader?success=true&orderId=" + order.getId())
                    .setCancelUrl("http://localhost:5173" + "/loader?success=false&orderId=" + order.getId())
                    .build();



            Session session = Session.create(params);
            return Response.success("Payment page is ready. You will be redirected to complete your payment.")
                    .withStripeUrl(session.getUrl());



        } catch (StripeException e) {
            return Response.error("Payment service is currently unavailable. Please try again later.", 503);
        } catch (Exception e) {
            return Response.error("Failed to process payment. Please try again.", 500);
        }
    }


    @Override
    public Response verifyStripePayment(Map<String, String> payload) {

        try {

            if (payload == null || payload.isEmpty()) {
                return Response.error("Payment verification failed. No payment details received.", 400);
            }

            String orderId = payload.get("orderId");
            String success = payload.get("success");

            if (success.equals("true")) {
                OrderEntity orderEntity = getOrderId(Long.valueOf(orderId));

                if (orderEntity == null) {
                    return Response.error("Order not found. Please contact support with your order details.", 404);
                }
                if (orderEntity.isPaid()) {
                    return Response.success("This order has already been paid.").withOrder(DtoConverter.convertOrdertoOrderDto(orderEntity));
                }
                orderEntity.setPaid(true);
                orderEntity.setOrderStatus(OrderStatus.PENDING);
                OrderEntity savedOrder = orderRepository.save(orderEntity);

                return Response.success("Payment successful! Your order is now being processed.")
                        .withOrder(DtoConverter.convertOrdertoOrderDto(savedOrder));
            } else {

                return Response.error("Payment Failed",400);
            }

        } catch (Exception e) {

            return  Response.error(e.getMessage(),400);
        }

    }


    public Response getTotalAmount() {
        try {
            List<OrderEntity> orderEntities = orderRepository.findByIsPaid(true);
            if (orderEntities == null || orderEntities.isEmpty()) {
                return Response.success("No completed orders found").withAmount(0);
            }

            int earnings = 0;
            for (OrderEntity orderEntity : orderEntities) {
                earnings += orderEntity.getAmount();
            }
            return Response.success("Total earnings from completed orders: $" + earnings)
                    .withAmount(earnings);
        } catch (Exception e) {
            return Response.error("Unable to calculate total earnings at this time. Please try again later.", 500);
        }
    }

    @Override
    public int getAllOrdersCount() {
        try {
            List<OrderEntity> orderEntities = orderRepository.findAll();
            return orderEntities.size();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public Response getDeliverBoyOrders(Long id) {

        try{
            if (id == null || id <= 0) {
                return Response.error("Invalid delivery person ID", 400);
            }


            List<OrderEntity>orderEntityList=orderRepository.findByDeliveryBoyId(id);

            if(orderEntityList.isEmpty()){
                return Response.success("You currently have no delivery assignments")
                        .withOrders(Collections.emptyList());
            }
            Set<Long> customerIds = orderEntityList.stream()
                    .map(OrderEntity::getUserId)
                    .collect(Collectors.toSet());

            // 3. Fetch all customers in one query
            Map<Long, String> customerNames = userRepository.findAllById(customerIds)
                    .stream()
                    .collect(Collectors.toMap(
                            UserEntity::getId,
                            UserEntity::getName
                    ));

            List<OrderDto> orderDtos = orderEntityList.stream()
                    .map(order -> {
                        OrderDto dto = DtoConverter.convertOrdertoOrderDto(order);
                        dto.setCustomerName(customerNames.getOrDefault(order.getUserId(), "Unknown Customer"));
                        return dto;
                    })
                    .collect(Collectors.toList());

            return Response.success("Found " + orderDtos.size() + " delivery assignments")
                    .withOrders(orderDtos);
        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 400);

        } catch (Exception e) {
            return Response.error("The order cannot be completed", 400);

        }
    }

    @Override
    public int getPendingOrdersCount() {
        try {
            List<OrderEntity> orderEntities = orderRepository.findByOrderStatus(OrderStatus.PENDING);
            return orderEntities != null ? orderEntities.size() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public int getCompletedOrdersCount() {
        try {
            List<OrderEntity> orderEntities = orderRepository.findByOrderStatus(OrderStatus.COMPLETED);
            return orderEntities != null ? orderEntities.size() : 0;
        } catch (Exception e) {
            return 0;
        }
    }



    @Override
    public int todayOrdersCount() {

        try {
            return orderRepository.countTodayOrders();
        } catch (Exception e) {

            return 0;
        }

    }




}
