package org.ai.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.model.UserEntity;
import org.ai.server.request.LoginRequest;
import org.ai.server.service.AuthService;
import org.ai.server.service.ForgotPasswordHandlerService;
import org.ai.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final ForgotPasswordHandlerService forgotPasswordHandlerService;
    private final UserService userService;
    private final UserRepository userRepository;


    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest){
        Response response=authService.LoginUser(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping(value = "/register", consumes = {"multipart/form-data"})
    public ResponseEntity<Response> userRegister(@RequestPart("user") String userString, @RequestPart(value = "image", required = false) MultipartFile imageFile) throws JsonProcessingException {
        ObjectMapper objectMapper=new ObjectMapper();
        UserEntity user=objectMapper.readValue(userString,UserEntity.class);
        Response response = authService.RegisterUser(user,imageFile);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/updateRole")
    public ResponseEntity<Response> updateRole(@RequestHeader("Authorization") String token, @RequestPart(value = "image", required = false) MultipartFile imageFile){
        Response response=userService.getUserByToken(token);
        UserDto userDto=response.getUserDto();
        UserEntity user=userRepository.findByEmail(userDto.getEmail());
        Response response1=authService.createPendingDeliverer(user,imageFile);
        return ResponseEntity.status(response.getStatusCode()).body(response1);

    }



    @PostMapping("/forgotpassword/send-otp")
    public ResponseEntity<Response> sendForgetPasswordOtp(@RequestParam String email){
        Response response=forgotPasswordHandlerService.sendForgetPasswordOtp(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping("/forgotpassword/verify-otp")
    public ResponseEntity<Response> verifyOtp(@RequestParam String email, @RequestParam String otp)   {
        Response response = forgotPasswordHandlerService.verifyOtp(email,otp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping("/forgotpassword/reset-password")
    public ResponseEntity<Response> resetPassword(@RequestParam String email, @RequestParam String newPassword, @RequestParam String otp) {
        Response response = forgotPasswordHandlerService.resetPassword(email,newPassword,otp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
