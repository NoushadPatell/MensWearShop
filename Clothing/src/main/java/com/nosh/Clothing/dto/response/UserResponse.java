package com.nosh.Clothing.dto.response;

import com.nosh.Clothing.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private User.Role role;
}
