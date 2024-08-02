package com.example.cartservice.exception;

import com.example.cartservice.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
//     Handle Other error
//    @ExceptionHandler(value = Exception.class)
//    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
//        ApiResponse apiResponse = new ApiResponse();
//
//        apiResponse.setCode(ErrorCode.EXCEPTION.getCode());
//        apiResponse.setMessage(ErrorCode.EXCEPTION.getMessage());
//
//        return ResponseEntity.badRequest().body(apiResponse);
//    }

    //    Handle Error that user define
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception){
        System.out.println("aaaaaaaaaa");

        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
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

//    @ExceptionHandler(value = AccessDeniedException.class)
//    public ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception){
//        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
//
//        return ResponseEntity.status(errorCode.getStatusCode()).body(
//                ApiResponse.builder()
//                        .code(errorCode.getCode())
//                        .message(errorCode.getMessage())
//                        .build()
//        );
//    }

}
