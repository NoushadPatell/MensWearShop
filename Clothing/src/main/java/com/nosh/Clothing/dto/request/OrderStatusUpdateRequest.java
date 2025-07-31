package com.nosh.Clothing.dto.request;

import com.nosh.Clothing.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull
    private Order.Status status;
}
