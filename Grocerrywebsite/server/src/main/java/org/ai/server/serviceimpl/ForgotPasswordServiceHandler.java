package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.ForgotPasswordRepository;
import org.ai.server.model.ForgotPasswordTokenEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.ForgotPasswordService;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ForgotPasswordServiceHandler implements ForgotPasswordService {

 private final ForgotPasswordRepository forgotPasswordRepository;


    @Override
    public ForgotPasswordTokenEntity createToken(UserEntity user, String id, String otp, String sendTo) {
        ForgotPasswordTokenEntity forgotPasswordToken = new ForgotPasswordTokenEntity();
        forgotPasswordToken.setUserEntity(user);
        forgotPasswordToken.setOtp(otp);
        forgotPasswordToken.setId(id);
        forgotPasswordToken.setEmail(sendTo);
        return forgotPasswordRepository.save(forgotPasswordToken);
    }

    @Override
    public ForgotPasswordTokenEntity findByUser(Long userId) {
        return forgotPasswordRepository.findByUserEntity_id(userId);
    }



    @Override
    public void deleteTokenByUserId(Long id) {
        ForgotPasswordTokenEntity forgotPasswordToken = findByUser(id);
        forgotPasswordRepository.delete(forgotPasswordToken);

    }
}
