package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.model.AddressEntity;

public interface AddressService {

    Response addAddress(AddressEntity address);
    Response getAddressUser(Long userId);

}
