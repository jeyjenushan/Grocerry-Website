package org.ai.server.Repository;

import org.ai.server.enumPackage.Role;
import org.ai.server.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {
    UserEntity findByEmail(String username);

    boolean existsByEmail(String email);

    List<UserEntity> findByRole(Role role);

    boolean existsByEmailAndRoleIn(String email, List<Role> list);

    boolean existsByEmailAndRole(String email, Role role);
}
