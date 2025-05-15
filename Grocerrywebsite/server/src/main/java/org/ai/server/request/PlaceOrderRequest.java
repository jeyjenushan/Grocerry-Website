package org.ai.server.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ai.server.model.AddressEntity;

import java.util.List;

@Data
@AllArgsConstructor
public class PlaceOrderRequest {

    private List<OrderItemRequest> items;
    private AddressEntity address;
}
