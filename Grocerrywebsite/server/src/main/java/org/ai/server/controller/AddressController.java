package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.model.AddressEntity;
import org.ai.server.service.AddressService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;



    @PostMapping("/addAddress")
    public ResponseEntity<Response> addAddress(@RequestBody AddressEntity address, @RequestHeader("Authorization")String token){
        Response response=userService.getUserByToken(token);
        UserDto userDto=response.getUserDto();
        address.setUserId(userDto.getId());
        Response response1=addressService.addAddress(address);
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }

    @GetMapping("/getAddress")
    public ResponseEntity<Response> getAddress( @RequestHeader("Authorization")String token){
        Response response=userService.getUserByToken(token);
        Response response1=addressService.getAddressUser(response.getUserDto().getId());
        return ResponseEntity.status(response1.getStatusCode()).body(response1);
    }
}
