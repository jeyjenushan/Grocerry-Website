package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.model.NotificationEntity;
import org.ai.server.service.NotificationService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;


    @GetMapping
    public ResponseEntity<Response> getAdminNotifications() {


        Response response1=notificationService.getAdminNotifications();
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Response> markNotificationAsRead(@PathVariable Long id) {
        Response response=notificationService.markAsRead(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping("/{notificationId}/action-taken")
    public ResponseEntity<Response> markNotificationActionTaken(@PathVariable Long notificationId) {
        Response response= notificationService.markActionTaken(notificationId);
          return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @GetMapping("/reject")
    public ResponseEntity<Response> getRejectedDeliverer(@RequestHeader("Authorization")String authHeader) {

        System.out.println("jenushan notifications");
        Response response=userService.getUserByToken(authHeader);
        String email=response.getUserDto().getEmail();
        Response response1=notificationService.getRejectedUser(email);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }
}