package com.nosh.Clothing.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateRequest {
    @NotBlank
    private String shippingAddress;

    @NotEmpty
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotBlank
        private String size;

        @NotNull
        @Positive
        private Integer quantity;
    }
}
