package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.model.UserEntity;

public interface ForgotPasswordHandlerService {

    Response sendForgetPasswordOtp(String email);
    Response verifyOtp(String email, String otp);
    Response resetPassword(String email, String newPassword, String otp);
    void updatePassword(UserEntity userAccount, String newPassword);
    boolean OtpCheck(String email, String otp);


}
