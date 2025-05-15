package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.request.UpdateCartRequest;

public interface CartService {
    Response updateCartItems(UpdateCartRequest updateCartRequest, String email);
}
