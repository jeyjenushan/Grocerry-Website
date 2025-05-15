package org.ai.server.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.request.PlaceOrderRequest;
import org.ai.server.service.OrderService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping("/placeOrder")
    public ResponseEntity<Response> placeOrderCod(@RequestHeader("Authorization") String authToken, @RequestBody PlaceOrderRequest placeOrderRequest){
        Response response =userService.getUserByToken(authToken);
        UserDto userDto=response.getUserDto();
        Response response1=orderService.placeOrderCOD(userDto.getId(),placeOrderRequest);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);

    }





    @GetMapping
    public ResponseEntity<Response> getOrders(){
        Response response1=orderService.getAllOrders();
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }



    @PostMapping("/pay")
    public ResponseEntity<Response> createStripeSession(@RequestHeader("Authorization") String token, @RequestBody PlaceOrderRequest placeOrderRequest,
                                                        HttpServletRequest request) {
        Response response=userService.getUserByToken(token);
        Response response1=orderService.placeOrderStripe(response.getUserDto().getId(),placeOrderRequest, request);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }


    @PostMapping("/verify")
    public ResponseEntity<Response> verifyStripePayment(@RequestBody Map<String, String> payload) {
        Response response = orderService.verifyStripePayment(payload);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/totalAmount")
    public ResponseEntity<Response> getTotalAmount(@RequestHeader("Authorization") String authToken){
        Response response =orderService.getTotalAmount();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    //User orders
    @GetMapping("/user")
    public ResponseEntity<Response> getOrderUsers(@RequestHeader("Authorization")String authToken){
        Response response =userService.getUserByToken(authToken);
        Response response1=orderService.getUserOrders(response.getUserDto().getId());
        return ResponseEntity.status(response1.getStatusCode()).body(response1);

    }



    //deliveryBoyorders
    @GetMapping("/getAllOrders")
    public ResponseEntity<Response> getDeliveryBoyOrders(@RequestHeader("Authorization") String authToken){

        Response response=userService.getUserByToken(authToken);
        UserDto userDto=response.getUserDto();

        Response response1 =orderService.getDeliverBoyOrders(userDto.getId());
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }


}
