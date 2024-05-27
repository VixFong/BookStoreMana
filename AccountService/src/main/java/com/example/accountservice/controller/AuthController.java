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
import com.example.accountservice.service.UserService;
import com.example.accountservice.utils.JwtUtils;
import com.nimbusds.jose.JOSEException;
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

    protected static final long EXPIRATION_TIME = 60000; // 1 minute

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${server.port}")
    private String PORT_SERVER;

    @Value("${server.servlet.context-path}")
    private String CONTEXT_PATH;

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

    @GetMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestParam String email) throws JOSEException {
        try{
            // Generate token
            String token = jwtUtils.generateTokenEmail(email, EXPIRATION_TIME);

            // Create reset password URL
            String resetUrl = "http://localhost:"+ PORT_SERVER + CONTEXT_PATH + "/reset-password?token=" + token;


            System.out.println("to " + email);
            System.out.println("token=" + token);

            // Send email
            emailService.sendEmail(email, "Reset Password", resetUrl);
            return ApiResponse.<String>builder()
                    .data("Reset password email sent")
                    .build();

        }catch (Exception e){
            throw new AppException(ErrorCode.FAIL_SENDING_EMAIL);

        }

    }
    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordRequest request) throws ParseException, JOSEException {
        System.out.println("reset-password");
        if(!request.getPassword().equals(request.getConfirmPassword())){
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }

        // Verify token
        if (jwtUtils.isTokenExpired(token)) {
            throw new AppException(ErrorCode.EXPIRED_TOKEN);
        }

        String email = jwtUtils.extractEmail(token);;
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));

        System.out.println("user=" + user.getEmail());

//      Bcrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActivate(true);

        userRepository.save(user);

        return ApiResponse.<String>builder()
                .data("Password has been reset successfully")
                .build() ;
    }
}
