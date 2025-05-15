package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.service.DashBoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/dashboardData")
@AllArgsConstructor
public class DashboardController {

    private final DashBoardService dashBoardService;

    @GetMapping
    public ResponseEntity<Response> getDashboardData() {
        Response response=dashBoardService.getDashBoard();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
