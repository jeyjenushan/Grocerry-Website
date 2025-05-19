package org.ai.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class ProductRatingDto {
    private Long id;
    private Long userId;
    private int rating;
    private int productId;
}
