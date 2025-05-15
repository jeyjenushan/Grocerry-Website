package org.ai.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryBoyOrderStatsDto {
    private int totalAccepted;
    private int totalCompleted;
    private int todayAccepted;
    private int todayCompleted;
    private int pendingOrders;
    private long completionPercentage;
    private int[] weeklyAcceptedOrders;
    private int[] weeklyCompletedOrders;
}
