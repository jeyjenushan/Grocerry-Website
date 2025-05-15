package org.ai.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDto {
    // Financial Summary
    private int totalAmount;

    // User Counts
    private int deliveryBoyCount;
    private int customerCount;

    // Order Status Counts (All Time)
    private int totalOrders;
    private int pendingOrders;
    private int acceptedOrders;
    private int completedOrders;
    private int rejectedOrders;

    // Today's Order Status
    private int todayOrders;
    private int pendingTodayOrders;
    private int todayAcceptedOrders;
    private int todayCompletedOrders;
    private int todayRejectedOrders;

    // Product Availability
    private int totalProductsAvailable;

    // Product Categories
    private int organicVegetableCount;
    private int fruitsCount;
    private int drinksCount;
    private int instantCount;
    private int dairyCount;
    private int bakeryCount;
    private int grainsCount;
}
