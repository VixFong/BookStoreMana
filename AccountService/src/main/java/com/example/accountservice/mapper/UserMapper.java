package com.example.accountservice.mapper;


import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(CreateUserRequest request);

    UserResponse toUserResponse(User user);
}
