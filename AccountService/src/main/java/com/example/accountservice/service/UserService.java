package com.example.accountservice.service;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.mapper.UserMapper;
import com.example.accountservice.model.User;
import com.example.accountservice.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public UserResponse create(CreateUserRequest request){
        User user = userMapper.toUser(request);
        System.out.println("Service");

        user.setLock(true);
        user.setActivate(false);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public List<UserResponse> getUsers(){
        return (userRepository.findAll().stream().map(userMapper::toUserResponse).toList());
    }
}
