package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.UserEntity;
import org.ai.server.request.UpdateCartRequest;
import org.ai.server.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor

public class CartServiceHandler implements CartService {

    private final UserRepository userRepository;

    @Transactional
    @Override
    public Response updateCartItems(UpdateCartRequest updateCartRequest, String email) {

        try{

            UserEntity user = userRepository.findByEmail(email);
            if (user==null) {
                return Response.error("User account not found. Please log in again.", 404);
            }

            user.setCartItems(new HashMap<>(updateCartRequest.getCartItems()));

               UserEntity user1 = userRepository.save(user);
            System.out.println(user1);

// Convert to DTO
            UserDto userDto = DtoConverter.convertUsertoUserDto(user1);
            System.out.println(userDto);
            return Response.success("Successfully updated cart items").withUser(userDto);



        } catch (Exception e) {
           return Response.error("CartItems cannot be updated try again",403);
        }

    }
}
