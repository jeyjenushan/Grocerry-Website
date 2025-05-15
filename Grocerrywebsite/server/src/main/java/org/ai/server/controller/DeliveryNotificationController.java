package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.UserRepository;
import org.ai.server.configuration.JwtTokenProvider;
import org.ai.server.dto.Response;

import org.ai.server.service.DeliveryNotificationService;
import org.ai.server.service.DeliveryOrderService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliverynotifications")
@AllArgsConstructor
public class DeliveryNotificationController {
    private final DeliveryNotificationService deliveryNotificationService;
    private final UserService userService;



    @GetMapping("/allnotifications")
    public ResponseEntity<Response> getAllNotifications(@RequestHeader("Authorization")String token){
          Response response1=userService.getUserByToken(token);

        Response response=deliveryNotificationService.getUserNotifications(response1.getUserDto().getEmail());
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @PutMapping("/markNotification/{id}")
    public ResponseEntity<Response>markNotificationAsDelivered(@RequestHeader("Authorization")String token,@PathVariable  Long id){
        Response response1=userService.getUserByToken(token);
        Response response=deliveryNotificationService.markAsRead(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }





}
