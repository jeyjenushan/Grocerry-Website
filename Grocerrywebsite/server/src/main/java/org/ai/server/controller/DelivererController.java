package org.ai.server.controller;
import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.service.DelivererService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliverers")
@AllArgsConstructor
public class DelivererController {
    private final DelivererService delivererService;
    private final UserService userService;

    @PutMapping("/approve/{id}")
    public ResponseEntity<Response> approveDeliverer(@PathVariable Long id)  {
        Response response=delivererService.approveDeliverer(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @PutMapping("/decline/{id}")
    public ResponseEntity<Response> declineDeliverer(@PathVariable Long id)  {
        Response response=delivererService.rejectDeliverer(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }
    @GetMapping("/pendingDeliver")
    public ResponseEntity<Response> getPendingDeliverer(@RequestHeader("Authorization")String authHeader) {
        Response response=userService.getUserByToken(authHeader);
        String email=response.getUserDto().getEmail();
        Response response1=delivererService.getPendingDeliver(email);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);

    }






}
