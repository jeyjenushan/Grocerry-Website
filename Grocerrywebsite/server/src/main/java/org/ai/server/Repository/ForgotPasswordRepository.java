package org.ai.server.Repository;

import org.ai.server.model.ForgotPasswordTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordTokenEntity,String> {
    ForgotPasswordTokenEntity findByUserEntity_id(Long userId);
}