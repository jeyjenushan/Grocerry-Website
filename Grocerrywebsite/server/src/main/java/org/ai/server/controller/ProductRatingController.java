package org.ai.server.controller;

import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.request.RatingRequest;
import org.ai.server.service.RatingService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@AllArgsConstructor
public class ProductRatingController {
    private final RatingService ratingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Response> addRating(@RequestBody RatingRequest request,
                                       @RequestHeader("Authorization") String authHeader) {


        Response response1=userService.getUserByToken(authHeader);
        UserDto userDto=response1.getUserDto();

        Response response=ratingService.addRating(
                userDto.getEmail(),
                request.getProductId(),
                request.getRating()
        );
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }


@GetMapping("/{id}")
public ResponseEntity<Response>getRatingUser( @RequestHeader("Authorization") String authHeader,@PathVariable Long id){
    Response response1=userService.getUserByToken(authHeader);
    UserDto userDto=response1.getUserDto();

    Response response=ratingService.getUserRating(
            userDto.getEmail(),
        id
    );
    return ResponseEntity.status(response.getStatusCode()).body(response);
}}