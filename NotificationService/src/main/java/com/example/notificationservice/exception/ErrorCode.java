package com.example.notificationservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {


//    FAIL_UPLOAD_IMAGE(301, "Failed to upload image",HttpStatus.BAD_REQUEST),
//    AUTHOR_EXISTED(201,"Author has existed", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(201, "Notification not found", HttpStatus.NOT_FOUND),

    UNAUTHENTICATED(301,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(302, "Invalid token",HttpStatus.BAD_REQUEST),



    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
