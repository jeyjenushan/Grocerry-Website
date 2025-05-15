package org.ai.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordTokenEntity {
    @Id
    private String id;
    @OneToOne
    private UserEntity userEntity;
    private String otp;
    private String email;
}
