package com.flovera.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // "CUSTOMER" or "ADMIN" - the tab the user picked on the login page.
    // The server validates that the account's actual role matches this.
    @NotBlank
    private String loginAs;
}
