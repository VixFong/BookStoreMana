package com.example.accountservice.service;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.ImageResponse;
import com.example.accountservice.dto.response.ProfileResponse;
import com.example.accountservice.dto.response.UserResponse;
import com.example.accountservice.exception.AppException;
import com.example.accountservice.exception.ErrorCode;
import com.example.accountservice.mapper.UserMapper;
import com.example.accountservice.model.Role;
import com.example.accountservice.model.User;
import com.example.accountservice.repo.ImageServiceClient;
import com.example.accountservice.repo.RoleRepository;
import com.example.accountservice.repo.UserRepository;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ResetPasswordService resetPasswordService;

    @Autowired
    private ImageServiceClient imageServiceClient;

    @PreAuthorize("hasRole('Admin')")
    public UserResponse create(CreateUserRequest request) throws JOSEException, MessagingException {
        if(userRepository.existsUsersByEmail(request.getEmail())){
           throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toUser(request);

        int atIndex = request.getEmail().indexOf("@");
        String pass = request.getEmail().substring(0, atIndex);

        System.out.println(pass);
        user.setPassword(passwordEncoder.encode(pass));
        user.setLock(false);
        user.setActivate(false);
        user.setStartedDate(LocalDate.now());


        //Send mail
        resetPasswordService.sendMailToUser(request.getEmail());



        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse createCustomer(RegisterCustomerRequest request){
        User user = userMapper.toCustomer(request);
        System.out.println("customer add");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLock(false);
        user.setActivate(true);
        user.setStartedDate(LocalDate.now());

        Role adminRole = roleRepository.save(Role.builder()
                .name("Customer")
                .build());

        var roles = new HashSet<Role>();
        roles.add(adminRole);
        user.setRoles(roles);
        return userMapper.toUserResponse(userRepository.save(user));
    }


    @PreAuthorize("hasRole('Admin')")
    public List<UserResponse> getUsers(){
        return (userRepository.findAll().stream().map(userMapper::toUserResponse).toList());
    }

//    @PreAuthorize("hasRole('Admin')")
//    public Page<UserResponse> getPageUsers(int page, int size){
//        Pageable pageable = PageRequest.of(page, size);
//
//        Page<User> userPage = userRepository.findAll(pageable);
//        var users = userPage.getContent();
//        return userPage.map(userMapper::toUserResponse);
//    }

    @PreAuthorize("hasRole('Admin')")
    public UserResponse getUser(String id){
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public ProfileResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();


        User user = userRepository.findByEmail(email).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toProfileUser(user);
    }
    public UserResponse getUserByEmail(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    public ProfileResponse updateMyInfo(UpdateProfileRequest request) {
        System.out.println("update Info");
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var apiResponse = imageServiceClient.uploadImage(request.getFile(), "profile");

        System.out.println("Name "+user.getFullName());
        System.out.println("image " + apiResponse.getData());
        user.setProfilePicture(apiResponse.getData().getUrl());

        userMapper.updateProfileUser(user,request);


        return userMapper.toProfileUser(userRepository.save(user));
    }

    @PreAuthorize("hasRole('Admin')")
    public UserResponse updateUser(String id , UpdateUserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('Admin')")
    public List<UserResponse> searchUsers(String keyword) {
        List<User> users = userRepository.findByFullNameOrEmail(keyword);
        return users.stream().map(userMapper::toUserResponse).toList();
    }


    @PreAuthorize("hasRole('Admin')")
    public void delete(String id){
        userRepository.deleteById(id);
    }
}
