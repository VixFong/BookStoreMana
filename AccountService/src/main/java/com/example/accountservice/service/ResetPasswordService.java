package com.example.accountservice.service;

import com.example.accountservice.dto.request.ResetPasswordRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.exception.AppException;
import com.example.accountservice.exception.ErrorCode;
import com.example.accountservice.repo.UserRepository;
import com.example.accountservice.utils.JwtUtils;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public class ResetPasswordService {
    protected static final long EXPIRATION_TIME = 180000; // 3 minute

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${port.frontend}")
    private String PORT_FRONTEND;

    @Value("${server.servlet.context-path}")
    private String CONTEXT_PATH;

    @PreAuthorize("hasRole('Admin')")
    public void activateAccount(String email) throws JOSEException, MessagingException {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(user.isActivate()){
            throw new AppException(ErrorCode.ACCOUNT_ACTIVATED);
        }
        sendMailToUser(email);

    }

    public void checkIsUserActivate(String email)throws JOSEException, MessagingException{
        var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if the user is inactive and does not have the 'admin' role
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> "Admin".equals(role.getName()));

        if(!user.isActivate() && !isAdmin){
            throw new AppException(ErrorCode.ACCOUNT_UNACTIVATED);
        }
        else{
            sendMailToUser(email);
        }
    }

    public void sendMailToUser(String email) throws JOSEException {
        System.out.println("Send mail");

            // Generate token
            String token = jwtUtils.generateTokenEmail(email, EXPIRATION_TIME);

            // Create reset password URL
            String resetUrl = "http://localhost:"+ PORT_FRONTEND + "/UpdatePass?token=" + token;

            System.out.println("reset link " + resetUrl);

            System.out.println("to " + email);
            System.out.println("token=" + token);

            // Send email
            emailService.sendEmail(email, "Reset Password", resetUrl);

    }


    public void resetPassword(String token, ResetPasswordRequest request) throws ParseException, JOSEException {
        if(!(request.getPassword().equals(request.getConfirmPassword()))){
            throw new AppException(ErrorCode.NOT_MATCH_PASSWORD);
        }

        // Verify token
        if(jwtUtils.isTokenExpired(token)) {
            throw new AppException(ErrorCode.EXPIRED_TOKEN);
        }

        String email = jwtUtils.extractEmail(token);;
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND));

        System.out.println("user=" + user.getEmail());

//      Bcrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

//      Activate account
        if(!user.isActivate())
            user.setActivate(true);

        userRepository.save(user);
    }


}
