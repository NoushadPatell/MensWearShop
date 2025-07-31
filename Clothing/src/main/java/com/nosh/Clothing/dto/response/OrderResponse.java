package com.nosh.Clothing.dto.response;

import com.nosh.Clothing.model.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private UserResponse user;
    private BigDecimal totalPrice;
    private String shippingAddress;
    private Order.Status status;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
