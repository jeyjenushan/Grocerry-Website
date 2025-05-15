package org.ai.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double offerPrice;
    private List<String> image;
    private String category;
    private Boolean inStock = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
