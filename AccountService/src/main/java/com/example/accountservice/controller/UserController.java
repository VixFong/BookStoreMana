package com.example.accountservice.controller;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> addUser(@RequestBody CreateUserRequest request){
        System.out.println("Controller");
        return ApiResponse.<UserResponse>builder()
                .data(userService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .data(userService.getUsers())
                .build();
    }


}
