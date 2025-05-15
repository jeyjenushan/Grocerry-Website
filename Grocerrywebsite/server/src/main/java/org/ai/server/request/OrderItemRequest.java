package org.ai.server.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.ai.server.dto.ProductDto;


@Data
@AllArgsConstructor
public class OrderItemRequest {

    private ProductDto product;
    private Integer quantity;
}
