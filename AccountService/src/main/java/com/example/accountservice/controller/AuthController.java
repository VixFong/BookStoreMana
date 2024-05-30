package com.example.accountservice.controller;


import com.example.accountservice.dto.request.*;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.IntrospectResponse;
import com.example.accountservice.dto.response.LoginUserResponse;
import com.example.accountservice.exception.AppException;
import com.example.accountservice.exception.ErrorCode;
import com.example.accountservice.repo.UserRepository;
import com.example.accountservice.service.AuthService;
import com.example.accountservice.service.EmailService;
import com.example.accountservice.service.ResetPasswordService;
import com.example.accountservice.service.UserService;
import com.example.accountservice.utils.JwtUtils;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ResetPasswordService resetPasswordService;

    @PostMapping("/login")
    public ApiResponse<LoginUserResponse> login(@RequestBody LoginUserRequest request){
        System.out.println("Controller");

        var isAuthenticated = authService.authenticated(request);

        return ApiResponse.<LoginUserResponse>builder()
                .data(isAuthenticated)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> validate(@RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        var isValid = authService.validateToken(request);
        return ApiResponse.<IntrospectResponse>builder()
                .data(isValid)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws JOSEException, ParseException {
        authService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<LoginUserResponse> logout(@RequestBody RefreshTokenRequest request) throws JOSEException, ParseException {
        authService.refreshToken(request);
        return ApiResponse.<LoginUserResponse>builder()
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestBody EmailRequest request) throws JOSEException, MessagingException {
        resetPasswordService.sendMailToUser(request.getEmail());
        return ApiResponse.<String>builder()
                .data("Reset password email sent")
                .build();
    }
    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordRequest request) throws ParseException, JOSEException {
        resetPasswordService.resetPassword(token, request);
        return ApiResponse.<String>builder()
                .data("Password has been reset successfully")
                .build() ;
    }
}
