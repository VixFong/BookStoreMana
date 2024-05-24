package com.example.accountservice.mapper;


import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(CreateUserRequest request);

    User toCustomer(RegisterCustomerRequest request);

    User toProfileUser(UpdateProfileRequest request);

    UserResponse toUserResponse(User user);

    void updateUser(@MappingTarget User user, UpdateUserRequest request);

}
