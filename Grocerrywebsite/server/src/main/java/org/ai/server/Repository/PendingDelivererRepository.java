package org.ai.server.Repository;

import org.ai.server.enumPackage.ApprovalStatus;
import org.ai.server.model.PendingDelivererEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PendingDelivererRepository extends JpaRepository<PendingDelivererEntity,Long> {
    List<PendingDelivererEntity> findByStatus(ApprovalStatus approvalStatus);

    PendingDelivererEntity findByEmail(String email);
}
