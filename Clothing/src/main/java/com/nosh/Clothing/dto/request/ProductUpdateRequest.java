package com.nosh.Clothing.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private String sizes;
    private Integer quantityInStock;
}
