package com.example.accountservice.controller;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.GetUserResponse;
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
    public ApiResponse<UserResponse> addUser(@Valid @ModelAttribute CreateUserRequest request) throws JOSEException, MessagingException {
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

//    @GetMapping
//    public ApiResponse<List<UserResponse>> getUsers(){
//        return ApiResponse.<List<UserResponse>>builder()
//                .data(userService.getUsers())
//                .build();
//    }

    @GetMapping
    public ApiResponse<Page<UserResponse>> getPageUsers( @RequestParam int page,
                                                         @RequestParam int size){
        Page<UserResponse> userPage = userService.getPageUsers(page, size);
        return ApiResponse.<Page<UserResponse>>builder()
                .data(userPage)
                .build();
    }
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

    @PutMapping("/{id}/lock")
    public ApiResponse<String> toggleUserLock(@PathVariable String id, @RequestParam boolean isLock) {
        System.out.println("Lock user " + isLock);
        userService.toggleUserLock(id, isLock);
        return ApiResponse.<String>builder()
                .data(isLock ? "User locked successfully" : "User unlocked successfully")
                .build();
    }

    @GetMapping("{id}")
    public ApiResponse<GetUserResponse> getUser(@PathVariable String id){
        return ApiResponse.<GetUserResponse>builder()
                .data(userService.getUser(id))
                .build();
    }

    @PutMapping("{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String id, @ModelAttribute @Valid UpdateUserRequest request){
        System.out.println("Update");
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
