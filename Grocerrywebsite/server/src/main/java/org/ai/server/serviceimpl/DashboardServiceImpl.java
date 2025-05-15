package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.dto.DashboardDto;
import org.ai.server.dto.Response;
import org.ai.server.service.*;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class DashboardServiceImpl implements DashBoardService {
    private final OrderService orderService;
    private final UserService userService;
    private final DeliveryOrderService deliveryOrderService;
    private final ProductService productService;


    @Override
    public Response getDashBoard() {
        DashboardDto dashboardDto = new DashboardDto();

        // Financial
        dashboardDto.setTotalAmount(orderService.getTotalAmount().getAmount());

        // User Counts
        dashboardDto.setDeliveryBoyCount(userService.getDeliveryBoyCount().getCount());
        dashboardDto.setCustomerCount(userService.getCustomerCount().getCount());

        // Order Status
        dashboardDto.setTotalOrders(orderService.getAllOrdersCount());
        dashboardDto.setPendingOrders(orderService.getPendingOrdersCount());
        dashboardDto.setAcceptedOrders(deliveryOrderService.acceptedOrdersCount());
        dashboardDto.setCompletedOrders(orderService.getCompletedOrdersCount());
        dashboardDto.setRejectedOrders(deliveryOrderService.getCancelledOrdersCount());

        // Today's Orders
        dashboardDto.setTodayOrders(orderService.todayOrdersCount());
        dashboardDto.setPendingTodayOrders(orderService.todayOrdersCount()-(deliveryOrderService.acceptedDeliveriesOrdersCountToday()));
        dashboardDto.setTodayAcceptedOrders(deliveryOrderService.acceptedDeliveriesOrdersCountToday());
        dashboardDto.setTodayCompletedOrders(deliveryOrderService.completedDelliveriesOrdersCountToday());
        dashboardDto.setTodayRejectedOrders(deliveryOrderService.rejectedDeliveriesOrdersCountToday());

        // Products
        dashboardDto.setTotalProductsAvailable(productService.totalProductsByStock(true));
        dashboardDto.setOrganicVegetableCount(productService.totalProductsByCategory("Vegetables"));
        dashboardDto.setFruitsCount(productService.totalProductsByCategory("Fruits"));
        dashboardDto.setDrinksCount(productService.totalProductsByCategory("Drinks"));
        dashboardDto.setInstantCount(productService.totalProductsByCategory("Instant"));
        dashboardDto.setDairyCount(productService.totalProductsByCategory("Dairy"));
        dashboardDto.setBakeryCount(productService.totalProductsByCategory("Bakery"));
        dashboardDto.setGrainsCount(productService.totalProductsByCategory("Grains"));

        return Response.success("Products and order count successfully fetched ").withDashboardDto(dashboardDto);

    }
}
