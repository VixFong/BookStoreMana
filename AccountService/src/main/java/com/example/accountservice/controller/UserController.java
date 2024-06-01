package com.example.accountservice.controller;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.ProfileResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> addUser(@Valid @RequestBody CreateUserRequest request) throws JOSEException, MessagingException {
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

//    @GetMapping
//    public ApiResponse<Page<UserResponse>> getPageUsers( @RequestParam int page,
//                                                         @RequestParam int size){
//        Page<UserResponse> userPage = userService.getPageUsers(page, size);
//        return ApiResponse.<Page<UserResponse>>builder()
//                .data(userPage)
//                .build();
//    }
    @GetMapping("/info")
    public ApiResponse<ProfileResponse> getInfo(){
        return ApiResponse.<ProfileResponse>builder()
                .data(userService.getMyInfo())
                .build();


    }

    @PutMapping("/info")
    public ApiResponse<ProfileResponse> editInfo (@ModelAttribute @Valid UpdateProfileRequest request){
        return ApiResponse.<ProfileResponse>builder()
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
