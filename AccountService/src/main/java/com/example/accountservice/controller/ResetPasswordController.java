//package com.example.accountservice.controller;
//
//
//import com.example.accountservice.dto.request.ResetPasswordRequest;
//import com.example.accountservice.dto.response.ApiResponse;
//import com.example.accountservice.exception.AppException;
//import com.example.accountservice.exception.ErrorCode;
//import com.example.accountservice.repo.UserRepository;
//import com.example.accountservice.service.EmailService;
//import com.example.accountservice.service.UserService;
//import com.example.accountservice.utils.JwtUtils;
//import com.nimbusds.jose.JOSEException;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.web.bind.annotation.*;
//
//import java.text.ParseException;
//
//@RestController
//@RequestMapping("/reset-password")
//public class ResetPasswordController {
//    protected static final long EXPIRATION_TIME = 60000; // 1 minute
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private JwtUtils jwtUtils;
//
//    @Value("${server.port}")
//    private String PORT_SERVER;
//
//    @Value("${server.servlet.context-path}")
//    private String CONTEXT_PATH;
//
//
//    @GetMapping("/forgot-password")
//    public ApiResponse<String> forgotPassword(@RequestParam String email) throws JOSEException {
//       try{
//           // Generate token
//            String token = jwtUtils.generateTokenEmail(email, EXPIRATION_TIME);
//
//            // Create reset password URL
//            String resetUrl = "http://localhost:"+ PORT_SERVER + CONTEXT_PATH + "/reset-password2?token=" + token;
//
//
//           System.out.println("CONtext path" + CONTEXT_PATH);
//           System.out.println("to " + email);
//
//            // Send email
//            emailService.sendEmail(email, "Reset Password", resetUrl);
//            return ApiResponse.<String>builder()
//                    .data("Reset password email sent")
//                    .build();
//
//       }catch (Exception e){
//           throw new AppException(ErrorCode.FAIL_SENDING_EMAIL);
//
//       }
//
//    }
//
//
//    @PostMapping("/reset-password2")
//    public String resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordRequest request) throws ParseException, JOSEException {
//        if(request.getPassword().equals(request.getConfirmPassword())){
//            throw new AppException(ErrorCode.PASSWORD_INVALID);
//        }
//
////        String newPassword = password.get("password");
//
//        // Verify token
//        if (jwtUtils.isTokenExpired(token)) {
//           throw new AppException(ErrorCode.EXPIRED_TOKEN);
//        }
//
//        String email = jwtUtils.extractEmail(token);;
//        var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//        user.setPassword(request.getPassword());
//
//
//        return "Password has been reset successfully";
//    }
//}
