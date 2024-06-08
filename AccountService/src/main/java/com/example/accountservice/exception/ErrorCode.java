package com.example.accountservice.exception;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_EXISTED(201,"Account has existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(202, "User not found", HttpStatus.NOT_FOUND),
    EMAIL_INVALID(203,"Invalid email",HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(204,"Password must be at least 6 characters",HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(205,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(206, "You do not have permission",HttpStatus.FORBIDDEN),
    INVALID_TOKEN(207, "Invalid token",HttpStatus.BAD_REQUEST),
    EXPIRED_TOKEN(208, "Token has been expired",HttpStatus.BAD_REQUEST),
    FAIL_SENDING_EMAIL(209, "Error occurred while sending reset password email",HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED(210, "Your account has been locked",HttpStatus.BAD_REQUEST),
    ACCOUNT_UNACTIVATED(211, "Your account is not activate. Please contact to admin",HttpStatus.BAD_REQUEST),
    ACCOUNT_ACTIVATED(212, "This account has activated",HttpStatus.BAD_REQUEST),

    NOT_MATCH_PASSWORD(213, "Your confirm password is not match with password",HttpStatus.BAD_REQUEST),
    FAIL_UPLOAD_IMAGE(214, "Upload image fail", HttpStatus.BAD_REQUEST),

    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
