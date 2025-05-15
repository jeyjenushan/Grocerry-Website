package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.model.UserEntity;

public interface UserService {

    Response getUserByToken(String token);
    Response getCustomerCount();
    Response getDeliveryBoyCount();


    Response getDeliveryBoyDetails();

    Response deleteDeliveryBoyDetails(Long deliveryId);
}
