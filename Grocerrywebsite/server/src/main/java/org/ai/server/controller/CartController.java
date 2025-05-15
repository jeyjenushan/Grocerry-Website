package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.request.UpdateCartRequest;
import org.ai.server.service.CartService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {
    private final UserService userService;
    private final CartService cartService;


    @PutMapping("/updateCart")
    public ResponseEntity<Response> updateCart(@RequestBody UpdateCartRequest updateCartRequest,@RequestHeader("Authorization")String token) {
        Response response=userService.getUserByToken(token);
        Response response1 =cartService.updateCartItems(updateCartRequest,response.getUserDto().getEmail());
        return ResponseEntity.status(response1.getStatusCode()).body(response);

    }
}
