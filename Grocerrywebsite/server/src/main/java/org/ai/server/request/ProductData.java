package org.ai.server.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductData {
    private String name;
    private double price;
    private int quantity;
}
