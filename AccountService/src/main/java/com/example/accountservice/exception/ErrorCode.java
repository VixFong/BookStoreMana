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

    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
