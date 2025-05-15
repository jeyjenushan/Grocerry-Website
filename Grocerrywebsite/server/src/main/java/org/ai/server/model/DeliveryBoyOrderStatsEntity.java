package org.ai.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "deliveryBoyOrderStats")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryBoyOrderStatsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long DeliveryBoyId;
    private int acceptedDeliveries;
    private int completedDeliveries;
    private int todayAcceptedDeliveries;
    private int todayCompletedDeliveries;
    private int pendingDeliveries;
    private Long completionPercentage;
}
