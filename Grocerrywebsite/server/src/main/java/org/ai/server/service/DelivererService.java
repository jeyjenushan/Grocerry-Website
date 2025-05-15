package org.ai.server.service;

import jakarta.mail.MessagingException;
import org.ai.server.dto.PendingDeliverDto;
import org.ai.server.dto.Response;
import org.springframework.stereotype.Service;



@Service
public interface DelivererService {
    Response approveDeliverer(Long id) ;
    Response rejectDeliverer(Long notificationId);


    Response getPendingDeliver(String email);
}
