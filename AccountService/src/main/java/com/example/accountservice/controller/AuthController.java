package com.example.accountservice.controller;


import com.example.accountservice.dto.request.IntrospectRequest;
import com.example.accountservice.dto.request.LoginUserRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.IntrospectResponse;
import com.example.accountservice.dto.response.LoginUserResponse;
import com.example.accountservice.service.AuthService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginUserResponse> login(@RequestBody LoginUserRequest request){
        var isAuthenticated = authService.authenticated(request);

        return ApiResponse.<LoginUserResponse>builder()
                .data(isAuthenticated)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> validate(@RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        var isValid = authService.validateToken(request);
//        System.out.println(isValid);
        return ApiResponse.<IntrospectResponse>builder()
                .data(isValid)
                .build();
    }

}
