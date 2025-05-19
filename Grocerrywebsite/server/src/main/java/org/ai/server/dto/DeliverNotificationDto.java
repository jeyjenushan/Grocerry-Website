package org.ai.server.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.server.enumPackage.DeliveryNotification;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliverNotificationDto {

    private Long id;

    private UserDto user;

    private String message;

    private DeliveryNotification type;

    private boolean isRead=false;
   private Long deliveryOrderId;

    private LocalDateTime createdAt;
}
