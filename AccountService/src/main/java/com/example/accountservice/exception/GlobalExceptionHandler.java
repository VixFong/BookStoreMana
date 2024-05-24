package com.example.accountservice.exception;

import com.example.accountservice.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handle Other error
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(){
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(ErrorCode.EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.EXCEPTION.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    //    Handle Validation
    @ExceptionHandler({MethodArgumentNotValidException.class})
    ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception){
        String enumKey = exception.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.valueOf(enumKey);

        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
