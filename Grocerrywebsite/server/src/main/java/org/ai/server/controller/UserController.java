package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/userDetails")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Response> getUserDetails(@RequestHeader("Authorization") String token) {
        Response response=userService.getUserByToken(token);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("/customerCount")
    public ResponseEntity<Response>getCustomerCount(){
        Response response=userService.getCustomerCount();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/delivererCount")
    public ResponseEntity<Response>getDelivererCount(){
        Response response=userService.getDeliveryBoyCount();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
     @GetMapping("/deliveryDetails")
    public ResponseEntity<Response>getDeliveryBoyDetails(){
        Response response=userService.getDeliveryBoyDetails();
        return ResponseEntity.status(response.getStatusCode()).body(response);
     }
     @DeleteMapping("/{deliveryId}")
     public ResponseEntity<Response>deleteDeliveryBoyDetails(@RequestHeader("Authorization") String token,@PathVariable Long deliveryId){
        Response response=userService.deleteDeliveryBoyDetails(deliveryId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
     }



}
