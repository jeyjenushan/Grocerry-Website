package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.Response;
import org.ai.server.model.ForgotPasswordTokenEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.otpUtils.GenerateOtp;
import org.ai.server.service.EmailService;
import org.ai.server.service.ForgotPasswordHandlerService;
import org.ai.server.service.ForgotPasswordService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ForgotPasswordHandlerServiceImplementation implements ForgotPasswordHandlerService {

    private final UserRepository userRepository;
    private final ForgotPasswordService forgotPasswordService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;




    @Override
    public Response sendForgetPasswordOtp(String email) {
        try {
            UserEntity user = userRepository.findByEmail(email);
            if (user == null) {
                return Response.error("The user is not registered in this website",404);
            }

            ForgotPasswordTokenEntity token = forgotPasswordService.findByUser(user.getId());
            String otp = GenerateOtp.generateOtp();
            UUID uuid = UUID.randomUUID();
            String id = uuid.toString();

            if (token != null) {
                forgotPasswordService.deleteTokenByUserId(user.getId());
            }
            token = forgotPasswordService.createToken(user, id, otp, email);


            emailService.sendEmail(email,"Your Forgot Password Verification Code\n\n","Your verification code is " + token.getOtp());
           return Response.success("Password reset OTP sent successfully");

        } catch (Exception e) {

            return Response.error("Error sending password reset OTP: " + e.getMessage(),404);
        }

    }

    @Override
    public Response verifyOtp(String email, String otp) {
        try {
            UserEntity userAccount = userRepository.findByEmail(email);
            if (userAccount == null) {
               return Response.error("The user is not registered in this website",404);
            }

            ForgotPasswordTokenEntity forgotPasswordToken = forgotPasswordService.findByUser(userAccount.getId());
            if (forgotPasswordToken == null) {

                return Response.error("Invalid or expired token.",404);

            }

            if (forgotPasswordToken.getOtp().equals(otp)) {
               return Response.success("OTP verified successfully.");
            } else {
                return Response.error("Wrong OTP provided.",400);
            }
        } catch (Exception e) {
             return Response.error("Error verifying OTP: " + e.getMessage(),500);
        }

    }

    public Response resetPassword(String email, String newPassword, String otp) {
        try {
            if (newPassword.length() <= 4) {
               return Response.error("Password must be at least 4 characters long.",400);
            }

            boolean isVerified = OtpCheck(email, otp);
            if (isVerified) {
                UserEntity userAccount = userRepository.findByEmail(email);
                if (userAccount == null) {

                    return Response.error("User not found with provided email.",404);
                }

                updatePassword(userAccount, newPassword);

               return Response.success("Password updated successfully!");
            } else {
               return Response.error("Wrong OTP provided.",400);
            }
        } catch (Exception e) {

            return Response.error("Error resetting password: " + e.getMessage(),400);
        }

    }

    public void updatePassword(UserEntity userAccount, String newPassword) {
        try {
            userAccount.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(userAccount);
        } catch (Exception e) {
            throw new RuntimeException("Error updating password: " + e.getMessage());
        }
    }

    public boolean OtpCheck(String email, String otp) {
        Response response = new Response();
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            response.setStatusCode(404);
            response.setMessage("User not found with provided email.");
        }
        ForgotPasswordTokenEntity forgotPasswordToken = forgotPasswordService.findByUser(user.getId());
        if (forgotPasswordToken == null) {
            response.setStatusCode(404);
            response.setMessage("Invalid or expired token.");
        }
        return forgotPasswordToken.getOtp().equals(otp);
    }
}
