package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.PendingDelivererRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.configuration.JwtTokenProvider;
import org.ai.server.dto.Response;
import org.ai.server.enumPackage.Role;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.PendingDelivererEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceHandler implements UserService {

    private final UserRepository userRepository;
    private final PendingDelivererRepository pendingDelivererRepository;


    @Override
    public Response getUserByToken(String token) {
       try{
           if (token == null || !token.startsWith("Bearer ")) {
               return Response.error("Please provide a valid authentication token", 400);
           }


           token=token.substring(7);
           String email=JwtTokenProvider.extractUsername(token);
           UserEntity user=userRepository.findByEmail(email);
           if(user==null){
               throw new RuntimeException("User not found");
           }
           return Response.success("Your profile information")
                   .withUser(DtoConverter.convertUsertoUserDto(user));

       }catch(RuntimeException e){
           return Response.error("The user not found",400);
       }  catch (Exception e) {
           return Response.error("We're having trouble loading your profile. Please try again.", 500);
       }
    }

    @Override
    public Response getCustomerCount() {
        try {
            List<UserEntity> users = userRepository.findByRole(Role.USER);
            return Response.success("Total customers: " + users.size())
                    .withCount(users.size());
        } catch (Exception e) {
            return Response.error("Couldn't retrieve customer count at this time", 500);
        }
    }

    @Override
    public Response getDeliveryBoyCount() {
        try {
            List<UserEntity> users = userRepository.findByRole(Role.DELIVERER);
            return Response.success("Total delivery partners: " + users.size())
                    .withCount(users.size());
        } catch (Exception e) {
            return Response.error("Couldn't retrieve delivery partner count at this time", 500);
        }
    }

    @Override
    public Response getDeliveryBoyDetails() {
        try {
            List<UserEntity> users = userRepository.findByRole(Role.DELIVERER);
            if (users.isEmpty()) {
                return Response.success("No delivery partners available")
                        .withUsers(Collections.emptyList());
            }
            return Response.success("Our delivery partners")
                    .withUsers(DtoConverter.convertUserListToUserDto(users));
        } catch (Exception e) {
            return Response.error("Couldn't retrieve delivery partner details at this time", 500);
        }
    }

    @Override
    public Response deleteDeliveryBoyDetails(Long deliveryId) {
        try {
            if (deliveryId == null) {
                return Response.error("Please select a delivery partner to remove", 400);
            }

            Optional<UserEntity> user = userRepository.findById(deliveryId);
            PendingDelivererEntity pendingDelivererEntity=pendingDelivererRepository.findByEmail(user.get().getEmail());
            if(pendingDelivererEntity==null){
                return Response.error("User not found", 400);
            }else{
                pendingDelivererRepository.delete(pendingDelivererEntity);
            }

            user.get().setRole(Role.USER);
            userRepository.save(user.get());



            return Response.success("Delivery partner removed successfully");
        } catch (Exception e) {
            return Response.error("We couldn't remove the delivery partner at this time. Please try again.", 500);
        }
    }


}
