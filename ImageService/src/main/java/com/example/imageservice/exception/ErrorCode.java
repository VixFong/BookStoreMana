package com.example.imageservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    IMAGE_NOT_FOUND(101,"Image not found", HttpStatus.NOT_FOUND),
    IMAGE_TYPE_INVALID(102, "Only JPEG, PNG, and GIF are allowed.",HttpStatus.BAD_REQUEST) ,
    IMAGE_SIZE_INVALID(103,"File size exceeds the maximum limit of 10 MB.",HttpStatus.BAD_REQUEST),
//    PASSWORD_INVALID(204,"Password must be at least 6 characters",HttpStatus.BAD_REQUEST),
//    UNAUTHENTICATED(205,"Unauthenticated",HttpStatus.UNAUTHORIZED),
//    UNAUTHORIZED(206, "You do not have permission",HttpStatus.FORBIDDEN),
//    INVALID_TOKEN(207, "Invalid token",HttpStatus.BAD_REQUEST),
//    EXPIRED_TOKEN(208, "Token has been expired",HttpStatus.BAD_REQUEST),
//    FAIL_SENDING_EMAIL(209, "Error occurred while sending reset password email",HttpStatus.BAD_REQUEST),
//    ACCOUNT_LOCKED(210, "Your account has been locked",HttpStatus.BAD_REQUEST),
//    ACCOUNT_UNACTIVATED(211, "Your account is not activate",HttpStatus.BAD_REQUEST),
//    NOT_MATCH_PASSWORD(212, "Your confirm password is not match with password",HttpStatus.BAD_REQUEST),


    EXCEPTION(500,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
