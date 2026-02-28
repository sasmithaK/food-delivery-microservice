package com.fooddeliverysystem.restaurentmanagemenetsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String password;
    private String role; // Will accept "ADMIN", "RESTAURANT_ADMIN", or "CUSTOMER"
    private String token;
}