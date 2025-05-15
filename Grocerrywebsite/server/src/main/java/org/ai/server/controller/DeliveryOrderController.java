package org.ai.server.controller;


import lombok.AllArgsConstructor;
import org.ai.server.Repository.UserRepository;
import org.ai.server.configuration.JwtTokenProvider;
import org.ai.server.dto.Response;
import org.ai.server.model.DeliveryOrderEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.DeliveryOrderService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@AllArgsConstructor
public class DeliveryOrderController {
    private final DeliveryOrderService deliveryOrderService;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/assign/{orderId}")
    public ResponseEntity<Response>assignOrderToDelivery(@PathVariable Long orderId){
        Response response=deliveryOrderService.assignOrderToDeliverer(orderId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @PutMapping("/accept/{id}")
    public ResponseEntity<Response> acceptDeliveries(@RequestHeader("Authorization")String token, @PathVariable Long id){
          Response response1=userService.getUserByToken(token);

        Response response=deliveryOrderService.acceptDelivery(id,response1.getUserDto().getId());
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @PutMapping("/decline/{id}")
    public ResponseEntity<Response> declineDeliveries(@RequestHeader("Authorization")String token, @PathVariable Long id){
           token=token.substring(7);
        String email= JwtTokenProvider.extractUsername(token);
        UserEntity user=userRepository.findByEmail(email);

        Response response=deliveryOrderService.rejectDelivery(id,user.getId());
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<Response> verifyDelivery(@RequestHeader("Authorization")String token, @PathVariable Long id,@RequestParam String verificationCode){
         token=token.substring(7);
        String email= JwtTokenProvider.extractUsername(token);
        Response response=deliveryOrderService.completeDelivery(id,verificationCode,email);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }
    @GetMapping("/getEarning")
    public ResponseEntity<Response> getEarning(@RequestHeader("Authorization")String token){
        token=token.substring(7);
        String email= JwtTokenProvider.extractUsername(token);
        Response response=deliveryOrderService.getEarnings(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);


    }
    @GetMapping("/deliveryOrderStats")
    public ResponseEntity<Response> getDeliveryOrderStats(@RequestHeader("Authorization")String token){
        Response response=userService.getUserByToken(token);
        String email=response.getUserDto().getEmail();
        Response response1=deliveryOrderService.getDeliveryBoyStat(email);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }

}
