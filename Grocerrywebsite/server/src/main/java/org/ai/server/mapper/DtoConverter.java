package org.ai.server.mapper;

import org.ai.server.dto.*;
import org.ai.server.model.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class DtoConverter {

    public static UserDto convertUsertoUserDto(UserEntity user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setImage(user.getImage());
        userDto.setRole(user.getRole());
        userDto.setCartItems(new HashMap<>(user.getCartItems()));
        return userDto;

    }

    public static List<UserDto> convertUserListToUserDto(List<UserEntity> userList){
        return userList.stream().map(DtoConverter::convertUsertoUserDto).collect(Collectors.toList());
    }
    public static AddressDto convertAddresstoAddressDto(AddressEntity address){
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCity(address.getCity());
        addressDto.setCountry(address.getCountry());
        addressDto.setStreet(address.getStreet());
        addressDto.setFirstName(address.getFirstName());
        addressDto.setLastName(address.getLastName());
        addressDto.setEmail(address.getEmail());
        addressDto.setPhone(address.getPhone());
        addressDto.setUserId(address.getUserId());
        addressDto.setState(address.getState());
        addressDto.setZipcode(address.getZipcode());
        return addressDto;


    }
    public static List<AddressDto> convertAddressListToAddressDtoList(List<AddressEntity> addressList){
        return addressList.stream().map(DtoConverter::convertAddresstoAddressDto).collect(Collectors.toList());
    }

    public static ProductDto convertProducttoProductDto(ProductEntity product){
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setCategory(product.getCategory());
        productDto.setImage(product.getImage());
        productDto.setInStock(product.getInStock());
        productDto.setOfferPrice(product.getOfferPrice());
        productDto.setCreatedAt(product.getCreatedAt());
        productDto.setUpdatedAt(product.getUpdatedAt());
        productDto.setAverageRating(product.getAverageRating());
        productDto.setRatingCount(product.getRatingCount());

        return productDto;

    }
    public static List<ProductDto> convertProductListToProductDto(List<ProductEntity> productList){
        return productList.stream().map(DtoConverter::convertProducttoProductDto).collect(Collectors.toList());
    }


    public static OrderItemDto convertOrderItemtoOrderItemDto(OrderItemEntity orderItem){
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setQuantity(orderItem.getQuantity());
        if(orderItem.getProduct() != null){
            orderItemDto.setProduct(convertProducttoProductDto(orderItem.getProduct()));
        }
        return orderItemDto;

    }
    public static List<OrderItemDto> convertOrderItemListToOrderItemDto(List<OrderItemEntity> orderItemList){
        return orderItemList.stream().map(DtoConverter::convertOrderItemtoOrderItemDto).collect(Collectors.toList());
    }

    public static OrderDto convertOrdertoOrderDto(OrderEntity order){
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setAddress(convertAddresstoAddressDto(order.getAddress()));
        orderDto.setAmount(order.getAmount());
        orderDto.setUserId(order.getUserId());
        orderDto.setStatus(order.getStatus());
        orderDto.setPaymentType(order.getPaymentType());
        orderDto.setPaid(order.isPaid());
        orderDto.setOrderStatus(order.getOrderStatus());
        orderDto.setCreatedAt(order.getCreatedAt());
        orderDto.setUpdatedAt(order.getUpdatedAt());
        if(order.getItems() != null){
            orderDto.setOrderItems(convertOrderItemListToOrderItemDto(order.getItems()));
        }



        return orderDto;

    }

    public static List<OrderDto> convertOrderListToOrderDto(List<OrderEntity> orderList){
        return orderList.stream().map(DtoConverter::convertOrdertoOrderDto).collect(Collectors.toList());
    }
    
    public static PendingDeliverDto convertPendingDeliverertoEntity(PendingDelivererEntity pendingDeliverer){
        PendingDeliverDto PendingDelivererDto = new PendingDeliverDto();
        PendingDelivererDto.setId(pendingDeliverer.getId());
        PendingDelivererDto.setName(pendingDeliverer.getName());
        PendingDelivererDto.setEmail(pendingDeliverer.getEmail());
        PendingDelivererDto.setImage(pendingDeliverer.getImage());
        return PendingDelivererDto;
        
    }


    public static List<PendingDeliverDto> convertPendingDelivererListToPendingDelivererDtoList(List<PendingDelivererEntity> pendingDelivererList){
        return pendingDelivererList.stream().map(DtoConverter::convertPendingDeliverertoEntity).collect(Collectors.toList());
    }

    public static NotificationDto convertNotificationtoNotificationDto(NotificationEntity notification){
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setId(notification.getId());
        notificationDto.setMessage(notification.getMessage());
        notificationDto.setCreatedAt(notification.getCreatedAt());
        notificationDto.setRead(notification.isRead());
        notificationDto.setAdminNotification(notification.isAdminNotification());
        notificationDto.setActionTaken(notification.isActionTaken());
        notificationDto.setType(notification.getType());
        if(notification.getRecipientEmail() != null){
            notificationDto.setRecipientEmail(notification.getRecipientEmail());
        }
        if(notificationDto.getUser() != null){
            notificationDto.setUser(DtoConverter.convertUsertoUserDto(notification.getUser()));
        }



        return notificationDto;
    }
public static List<NotificationDto> convertNotificationListToNotificationDtoList(List<NotificationEntity> notificationList){
        return notificationList.stream().map(DtoConverter::convertNotificationtoNotificationDto).collect(Collectors.toList());
}

public static DeliverOrderDto convertDeliveryOrderToDeliveryOrderDto(DeliveryOrderEntity deliveryOrder){
        DeliverOrderDto deliveryOrderDto = new DeliverOrderDto();
        deliveryOrderDto.setId(deliveryOrder.getId());
        deliveryOrderDto.setAcceptedAt(deliveryOrder.getAcceptedAt());
        deliveryOrderDto.setStatus(deliveryOrder.getStatus());
        deliveryOrderDto.setOrder(DtoConverter.convertOrdertoOrderDto(deliveryOrder.getOrder()));
        deliveryOrderDto.setDeliverer(DtoConverter.convertUsertoUserDto(deliveryOrder.getDeliverer()));
        deliveryOrderDto.setDeliveredAt(deliveryOrder.getDeliveredAt());
        return deliveryOrderDto;

}

public static List<DeliverOrderDto>convertDeliveryOrderListToDeliveryOrderDtoList(List<DeliveryOrderEntity> deliveryOrderList){
        return deliveryOrderList.stream().map(DtoConverter::convertDeliveryOrderToDeliveryOrderDto).collect(Collectors.toList());
}

public static DeliverNotificationDto convertDeliveryNotificationtoDeliveryNotificationDto(DeliverNotificationEntity deliverNotificationEntity){
        DeliverNotificationDto deliveryNotificationDto = new DeliverNotificationDto();
        deliveryNotificationDto.setId(deliverNotificationEntity.getId());
        deliveryNotificationDto.setMessage(deliverNotificationEntity.getMessage());
        deliveryNotificationDto.setCreatedAt(deliverNotificationEntity.getCreatedAt());
        deliveryNotificationDto.setRead(deliverNotificationEntity.isRead());
        deliveryNotificationDto.setType(deliverNotificationEntity.getType());
        deliveryNotificationDto.setDeliveryOrderId(deliverNotificationEntity.getDeliveryOrderId());
        deliveryNotificationDto.setUser(DtoConverter.convertUsertoUserDto(deliverNotificationEntity.getUser()));
        return deliveryNotificationDto;

}

public static List<DeliverNotificationDto> convertDeliveryNotificationListToDeliveryNotificationDtoList(List<DeliverNotificationEntity> deliverNotificationEntityList){
        return deliverNotificationEntityList.stream().map(DtoConverter::convertDeliveryNotificationtoDeliveryNotificationDto).collect(Collectors.toList());
}
public static DeliveryBoyOrderStatsDto convertDEliveryBoyOrderStatsDto(DeliveryBoyOrderStatsEntity deliveryBoyOrderStatsEntity){
        DeliveryBoyOrderStatsDto dto = new DeliveryBoyOrderStatsDto();
        dto.setPendingOrders(deliveryBoyOrderStatsEntity.getPendingDeliveries());
        dto.setTodayAccepted(deliveryBoyOrderStatsEntity.getTodayAcceptedDeliveries());
       dto.setTotalAccepted(deliveryBoyOrderStatsEntity.getAcceptedDeliveries());
        dto.setCompletionPercentage(deliveryBoyOrderStatsEntity.getCompletionPercentage());
        dto.setTodayCompleted(deliveryBoyOrderStatsEntity.getTodayCompletedDeliveries());
        dto.setTotalCompleted(deliveryBoyOrderStatsEntity.getCompletedDeliveries());
        return dto;


}
public static ProductRatingDto convertProductRatingEntityToProductRatingDto(ProductRatingEntity productRatingEntity){
        ProductRatingDto productRatingDto=new ProductRatingDto();
        productRatingDto.setRating(productRatingEntity.getRating());
        productRatingDto.setId(productRatingEntity.getId());
        productRatingDto.setUserId(productRatingEntity.getUser().getId());
        productRatingDto.setRating(productRatingEntity.getRating());
        productRatingDto.setProductId(productRatingDto.getProductId());
        return productRatingDto;

}

public static List<ProductRatingDto> convertProductRatingListToProductRatingDtoList(List<ProductRatingEntity> productRatingEntityList){
        return productRatingEntityList.stream().map(DtoConverter::convertProductRatingEntityToProductRatingDto).collect(Collectors.toList());
}


}
