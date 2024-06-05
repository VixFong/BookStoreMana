package com.example.accountservice.mapper;


import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.GetUserResponse;
import com.example.accountservice.dto.response.ProfileResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(CreateUserRequest request);

    GetUserResponse toGetUserResponse(User user);

    User toCustomer(RegisterCustomerRequest request);

    ProfileResponse toProfileUser(User user);

    UserResponse toUserResponse(User user);

//    @Mapping(target = "profilePicture", ignore = true)
    void updateProfileUser(@MappingTarget User user,UpdateProfileRequest request);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UpdateUserRequest request);

}
