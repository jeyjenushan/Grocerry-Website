package org.ai.server.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;
    private boolean success;
    private UserDto userDto;
    private AddressDto addressDto;
    private ProductDto productDto;
    private OrderDto orderDto;
    private OrderItemDto orderItemDto;
    private PendingDeliverDto pendingDeliverDto;
    private NotificationDto notificationDto;
    private DeliverOrderDto deliverOrderDto;
    private DeliveryBoyOrderStatsDto deliveryBoyOrderStatsDto;
    private DashboardDto dashboardDto;
    private List<DeliverOrderDto>deliverOrderDtoList;
    private DeliverNotificationDto deliverNotificationDto;
    private List<DeliverNotificationDto>deliverNotificationDtoList;
    private List<NotificationDto>notificationDtoList;
    private List<UserDto>userDtoList;
    private List<ProductDto> productDtoList;
    private List<OrderItemDto> orderItemDtoList;
    private List<OrderDto>orderDtoList;
    private List<AddressDto>addressDtoList;
    private List<PendingDeliverDto>pendingDeliverDtoList;


    //optional
    private  String token;
    private String expirationTime;
    private String stripeUrl;
    private int amount;
    private int count;
    private boolean rejected;


    // Success factory method
    public static Response success(String message) {
        Response response = new Response();
        response.setMessage(message);
        response.setSuccess(true);
        response.setStatusCode(200);
        return response;
    }

    // Error factory method
    public static Response error(String message, int statusCode) {
        Response response = new Response();
        response.setMessage(message);
        response.setSuccess(false);
        response.setStatusCode(statusCode);
        return response;
    }

    // User methods
    public Response withUser(UserDto user) {
        this.userDto = user;
        this.userDtoList = null;
        return this;
    }

    public Response withUsers(List<UserDto> users) {
        this.userDtoList = users;
        this.userDto = null;
        return this;
    }

    //Address methods
    public Response withAddress(AddressDto address) {
        this.addressDto = address;
        this.addressDtoList = null;
        return this;
    }

    public Response withAddress(List<AddressDto> address) {
        this.addressDtoList = address;
        this.addressDto = null;
        return this;
    }

    //Product methods
    public Response withProduct(ProductDto product) {
        this.productDto = product;
        this.productDtoList = null;
        return this;
    }

    public Response withProducts(List<ProductDto> products) {
        this.productDtoList = products;
        this.productDto = null;
        return this;
    }

    //Order item methods
    public Response withOrderItem(OrderItemDto orderItem) {
        this.orderItemDto = orderItem;
        this.orderItemDtoList = null;
        return this;
    }

    public Response withOrderItems(List<OrderItemDto> orderItemDtoList) {
        this.orderItemDtoList = orderItemDtoList;
        this.orderItemDto = null;
        return this;
    }


    //Order methods

    public Response withOrder(OrderDto order) {
        this.orderDto = order;
        this.orderDtoList = null;
        return this;
    }

    public Response withOrders(List<OrderDto> orderDtoList) {
        this.orderDtoList = orderDtoList;
        this.orderDto = null;
        return this;
    }
    public Response withTokenAndExpirationTime(String token, String expirationTime) {
        this.token = token;
        this.expirationTime = expirationTime;
        return this;
    }
    public Response withStripeUrl(String stripeUrl) {
        this.stripeUrl = stripeUrl;
        return this;
    }

    //pending delivers
    public Response withPendingDeliverDto(PendingDeliverDto pendingDeliverDto) {
        this.pendingDeliverDto = pendingDeliverDto;
        this.pendingDeliverDtoList = null;
        return this;

    }

    public Response withPendingDeliverDtos(List<PendingDeliverDto> pendingDeliverDtoList) {
        this.pendingDeliverDtoList = pendingDeliverDtoList;
        this.pendingDeliverDto = null;
        return this;
    }

    //Notification
    public Response withNotification(NotificationDto notificationDto)
    {
        this.notificationDto = notificationDto;
         this.notificationDtoList = null;
         return this;
    }
    public Response withNotifications(List<NotificationDto> notificationDtoList) {
        this.notificationDtoList = notificationDtoList;
        this.notificationDto = null;
        return this;
    }

    //delivery notification
    public Response withDeliverNotificationDto(DeliverNotificationDto deliverNotificationDto) {
        this.deliverNotificationDto = deliverNotificationDto;
        this.deliverNotificationDtoList = null;
        return this;
    }
    public Response withDeliverNotificationDtos(List<DeliverNotificationDto> deliverNotificationDtoList) {
        this.deliverNotificationDtoList = deliverNotificationDtoList;
        this.deliverNotificationDto = null;
        return this;
    }
    public Response withDeliverOrderDto(DeliverOrderDto deliverOrderDto) {
        this.deliverOrderDto = deliverOrderDto;
        this.deliverOrderDtoList = null;
        return this;
    }
    public Response withDeliverOrderDtos(List<DeliverOrderDto> deliverOrderDtoList) {
        this.deliverOrderDtoList = deliverOrderDtoList;
        this.deliverOrderDto = null;
        return this;
    }
     public Response withAmount(int amount) {
        this.amount = amount;
        return this;
     }
     public Response withCount(int count) {
        this.count = count;
        return this;

     }
     public Response withDeliveryBoyOrderStatsDto(DeliveryBoyOrderStatsDto deliveryBoyOrderStatsDto) {
        this.deliveryBoyOrderStatsDto = deliveryBoyOrderStatsDto;
        return this;

     }
     public Response withDashboardDto(DashboardDto dashboardDto) {
        this.dashboardDto = dashboardDto;
        return this;
     }
     public Response withRejected(boolean rejected) {
        this.rejected = rejected;
        return this;
     }




}
