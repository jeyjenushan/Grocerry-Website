package org.ai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ai.server.enumPackage.DeliveryNotification;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliverNotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private Long deliveryOrderId;

    private String message;

    @Enumerated(EnumType.STRING)
    private DeliveryNotification type;

    private boolean isRead=false;


    private LocalDateTime createdAt;
}
