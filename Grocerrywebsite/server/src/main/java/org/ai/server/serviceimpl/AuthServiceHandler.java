package org.ai.server.serviceimpl;

import com.fasterxml.jackson.core.JsonParseException;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.PendingDelivererRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.configuration.JwtTokenProvider;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.enumPackage.Role;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.PendingDelivererEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.request.LoginRequest;
import org.ai.server.service.AuthService;
import org.ai.server.service.CloudinaryService;
import org.ai.server.service.EmailService;
import org.ai.server.service.NotificationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;

@Service
@AllArgsConstructor
public class AuthServiceHandler implements AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final CloudinaryService cloudinaryService;
    private final PendingDelivererRepository pendingDelivererRepository;
    private final NotificationService notificationServiceHandler;

    @Override
    public Response LoginUser(LoginRequest loginRequest) {
        try {
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword()
                    )
            );

            // Fetch user details
            UserEntity userEntity = userRepository.findByEmail(loginRequest.getEmail());

            if (userEntity == null) {
                return Response.error("The user is not registered",401);
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(userEntity);
            Date expirationDate = JwtTokenProvider.extractExpiration(token);

            // Convert UserEntity to UserDto
            UserDto userDto = DtoConverter.convertUsertoUserDto(userEntity);

            return Response.success("The account has been logged in successfully.")
                    .withUser(DtoConverter.convertUsertoUserDto(userEntity))
                    .withTokenAndExpirationTime(token,expirationDate.toString());



        } catch (Exception e) {
            return Response.error("Login failed: " + e.getMessage(), 500);
        }


    }


    public Response RegisterUser(
       UserEntity userRequest,
 MultipartFile imageFile) {

        try {
            // Validate JSON payload structure first
            if (userRequest == null) {
                return Response.error("Invalid registration data", 400);
            }


            boolean emailExists = userRepository.existsByEmail(userRequest.getEmail());

            // Special case: Allow same email only for USER and DELIVERER roles
            if (emailExists) {
                if (
                        !userRepository.existsByEmailAndRoleIn(userRequest.getEmail(),
                                Arrays.asList(Role.USER, Role.DELIVERER))) {
                    return Response.error("Email already in use", 400);
                }

                if (userRepository.existsByEmailAndRole(userRequest.getEmail(), userRequest.getRole())) {
                    return Response.error("Email already in use for this role", 400);
                }
            }

            // Validate image file
            if (imageFile.isEmpty() || !isValidImageFile(imageFile)) {
                return Response.error("Valid profile image is required", 400);
            }

            // Convert request to entity
            UserEntity user = new UserEntity();
            user.setName(userRequest.getName());
            user.setEmail(userRequest.getEmail());
            user.setPassword(userRequest.getPassword());
            user.setRole(userRequest.getRole());

            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Handle role-specific logic
            if (user.getRole() == Role.SELLER) {
                user.setRole(Role.SELLER);
            } else if (user.getRole() == Role.DELIVERER) {
                return createPendingDeliverer(user, imageFile);
            } else {
                user.setRole(Role.USER);
            }

            // Upload image
            String thumbnailUrl = cloudinaryService.uploadFile(imageFile);
            if (thumbnailUrl == null) {
                return Response.error("Failed to upload profile image", 500);
            }
            user.setImage(thumbnailUrl);

            UserEntity savedUser = userRepository.save(user);
            return Response.success("User registered successfully")
                    .withUser(DtoConverter.convertUsertoUserDto(savedUser));

        } catch (JsonParseException e) {
            return Response.error("Invalid JSON format: " + e.getMessage(), 400);
        } catch (Exception e) {

   
            return Response.error(e.getMessage(), 500);
        }
    }


    public void updateRole(String email,MultipartFile imageFile)  {
        try{
            UserEntity user=userRepository.findByEmail(email);
            UserEntity userEntity=new UserEntity();
            userEntity.setEmail(email);
            userEntity.setRole(Role.DELIVERER);
            userEntity.setPassword(user.getPassword());
            userEntity.setName(user.getName());
            userRepository.delete(user);



            createPendingDeliverer(userEntity, imageFile);
        } catch (Exception e) {
            return;
        }


    }

    private boolean isValidImageFile(MultipartFile file) {
        if (file.getContentType() == null) return false;
        return file.getContentType().startsWith("image/");
    }

    public Response createPendingDeliverer(UserEntity user, MultipartFile imageFile)  {
        try{
            String thumbnailUrl = cloudinaryService.uploadFile(imageFile);
            if (thumbnailUrl == null) {
                return Response.error("Failed to upload profile image", 500);
            }

            PendingDelivererEntity pendingDeliverer = new PendingDelivererEntity();
            pendingDeliverer.setEmail(user.getEmail());
            pendingDeliverer.setPassword(user.getPassword());
            pendingDeliverer.setImage(thumbnailUrl);
            pendingDeliverer.setName(user.getName());
            pendingDelivererRepository.save(pendingDeliverer);

            // Notify admin (you can implement this separately)
            notificationServiceHandler.notifyAdminOfPendingDeliverer(pendingDeliverer);

            return Response.success("Your application has been submitted for admin approval. You will be notified via email once approved.");
        } catch (Exception e) {
         return Response.error("Failed to upload profile image", 500);
        }

    }

}
