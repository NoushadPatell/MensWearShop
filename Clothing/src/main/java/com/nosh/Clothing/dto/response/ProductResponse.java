package com.nosh.Clothing.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private String sizes;
    private Integer quantityInStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
