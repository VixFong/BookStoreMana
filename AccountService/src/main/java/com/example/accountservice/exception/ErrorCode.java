package com.example.accountservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_EXISTED(201,"Account has existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(202, "User not found", HttpStatus.NOT_FOUND),
    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
