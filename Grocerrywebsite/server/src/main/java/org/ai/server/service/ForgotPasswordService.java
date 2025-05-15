package org.ai.server.service;

import org.ai.server.model.ForgotPasswordTokenEntity;
import org.ai.server.model.UserEntity;

public interface ForgotPasswordService {
    ForgotPasswordTokenEntity createToken(UserEntity user, String id, String otp, String sendTo);
    ForgotPasswordTokenEntity findByUser(Long userId) ;


    void deleteTokenByUserId(Long id);
}
