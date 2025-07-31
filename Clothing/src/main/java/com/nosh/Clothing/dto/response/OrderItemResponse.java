package com.nosh.Clothing.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private ProductResponse product;
    private String size;
    private Integer quantity;
    private BigDecimal price;
}
