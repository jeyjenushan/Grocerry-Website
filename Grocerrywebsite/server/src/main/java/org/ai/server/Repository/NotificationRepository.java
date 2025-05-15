package org.ai.server.Repository;

import org.ai.server.enumPackage.NotificationType;
import org.ai.server.model.DeliverNotificationEntity;
import org.ai.server.model.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {



    List<NotificationEntity> findByIsAdminNotificationTrue();

    List<NotificationEntity> findByRecipientEmailAndTypeAndIsAdminNotificationTrue(String email, NotificationType notificationType);

    List<NotificationEntity> findByUserId(Long id);
}
