package com.example.accountservice.controller;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> addUser(@Valid @RequestBody CreateUserRequest request) throws JOSEException {
        System.out.println("Controller");
        return ApiResponse.<UserResponse>builder()
                .data(userService.create(request))
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(userService.createCustomer(request))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam String keyword) {
        return ApiResponse.<List<UserResponse>>builder()
                .data(userService.searchUsers(keyword))
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> getUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .data(userService.getUsers())
                .build();
    }

    @GetMapping("/info")
    public ApiResponse<UserResponse> getInfo(){
        return ApiResponse.<UserResponse>builder()
                .data(userService.getMyInfo())
                .build();


    }

    @PutMapping("/info")
    public ApiResponse<UserResponse> editInfo(@RequestBody @Valid UpdateProfileRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(userService.updateMyInfo(request))
                .build();


    }

    @PutMapping("{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String id, @RequestBody @Valid UpdateUserRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(userService.updateUser(id, request))
                .build();
    }

    @DeleteMapping("{id}")
    public ApiResponse<String> delete(@PathVariable String id){
        userService.delete(id);

        return ApiResponse.<String>builder()
                .data("Delete user success")
                .build();
    }

}
