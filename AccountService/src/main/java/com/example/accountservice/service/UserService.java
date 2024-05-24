package com.example.accountservice.service;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.ProfileResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.exception.AppException;
import com.example.accountservice.exception.ErrorCode;
import com.example.accountservice.mapper.UserMapper;
import com.example.accountservice.model.User;
import com.example.accountservice.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse create(CreateUserRequest request){
        if(userRepository.existsUsersByEmail(request.getEmail())){
           throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);
//        System.out.println("Service");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLock(true);
        user.setActivate(false);
        user.setStartedDate(new Date());
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse createCustomer(RegisterCustomerRequest request){
        User user = userMapper.toCustomer(request);
        System.out.println("Service");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLock(false);
        user.setActivate(true);
        user.setStartedDate(new Date());
        return userMapper.toUserResponse(userRepository.save(user));
    }



    public List<UserResponse> getUsers(){
        return (userRepository.findAll().stream().map(userMapper::toUserResponse).toList());
    }

    public UserResponse getUser(String id){
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public UserResponse updateUser(String id , UpdateUserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

//    public ProfileResponse updateProfileUser(String id , UpdateUserRequest request){
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//        userMapper.updateUser(user, request);
//        return userMapper.toUserResponse(userRepository.save(user));
//    }
    public void delete(String id){
        userRepository.deleteById(id);
    }
}
