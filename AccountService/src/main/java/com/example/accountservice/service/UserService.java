package com.example.accountservice.service;

import com.example.accountservice.dto.request.CreateUserRequest;
import com.example.accountservice.dto.request.RegisterCustomerRequest;
import com.example.accountservice.dto.request.UpdateProfileRequest;
import com.example.accountservice.dto.request.UpdateUserRequest;
import com.example.accountservice.dto.response.GetUserResponse;
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

//      Set password and bcrypt by using email
        int atIndex = request.getEmail().indexOf("@");
        String pass = request.getEmail().substring(0, atIndex);

        System.out.println(pass);
        user.setPassword(passwordEncoder.encode(pass));

//      Set lock
        user.setLock(false);

//      Set date
        user.setStartedDate(LocalDate.now());

//      Set Role
        Role role = roleRepository.save(Role.builder()
                .name(request.getRole())
                .build());

        var roles = new HashSet<Role>();
        roles.add(role);
        user.setRoles(roles);

        //Set activate
        if(!request.getRole().equals("Employee")) {
            user.setActivate(true);
        } else{
            user.setActivate(false);

        }

//      Set Profile picture

//      Check File is empty, it will set default image
        if(request.getFile() == null){
            user.setProfilePicture("http://res.cloudinary.com/dmdddwb1j/image/upload/v1717317645/profile/tcwclkd3qez4f8aygz5n.jpg");
        }
//      if having file
        else {
            var apiResponse = imageServiceClient.uploadImage(request.getFile(), "profile");
            if (apiResponse != null && apiResponse.getCode() == 100) {
                var image = apiResponse.getData().getUrl();
                user.setProfilePicture(image);
            }
            else{
                throw new AppException(ErrorCode.FAIL_SENDING_EMAIL);
            }
        }

        var saveUser = userRepository.save(user);

        //Send mail
        resetPasswordService.sendMailToUser(request.getEmail());


        return userMapper.toUserResponse(saveUser);
    }

    public UserResponse createCustomer(RegisterCustomerRequest request){
        User user = userMapper.toCustomer(request);
        System.out.println("customer add");
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLock(false);
        user.setActivate(true);
        user.setStartedDate(LocalDate.now());


//      Set role
        Role customerRole = roleRepository.save(Role.builder()
                .name("Customer")
                .build());

        var roles = new HashSet<Role>();
        roles.add(customerRole);
        user.setRoles(roles);

        // Set Profile picture
        user.setProfilePicture("http://res.cloudinary.com/dmdddwb1j/image/upload/v1717317645/profile/tcwclkd3qez4f8aygz5n.jpg");

        return userMapper.toUserResponse(userRepository.save(user));
    }


    @PreAuthorize("hasRole('Admin')")
    public List<UserResponse> getUsers(){
        return (userRepository.findAll().stream().map(userMapper::toUserResponse).toList());
    }

    @PreAuthorize("hasRole('Admin')")
    public Page<UserResponse> getPageUsers(int page, int size){
        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage = userRepository.findAll(pageable);
//        var users = userPage.getContent();
        return userPage.map(userMapper::toUserResponse);
    }

    @PreAuthorize("hasRole('Admin')")
    public void toggleUserLock(String id, boolean isLock) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setLock(isLock);
        userRepository.save(user);
    }

    @PreAuthorize("hasRole('Admin')")
    public GetUserResponse getUser(String id){
        return userMapper.toGetUserResponse(userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
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

        var apiResponse = imageServiceClient.uploadImage(request.getFile(),"profile");

        if(apiResponse.getCode() != 100){
            throw new AppException(ErrorCode.FAIL_UPLOAD_IMAGE);
        }
        System.out.println("Name " + user.getFullName());
        System.out.println("image " + apiResponse.getData().getUrl());

        userMapper.updateProfileUser(user,request);
        user.setProfilePicture(apiResponse.getData().getUrl());
        System.out.println("profile" + user.getProfilePicture());

        return userMapper.toProfileUser(userRepository.save(user));
    }

    @PreAuthorize("hasRole('Admin')")
    public UserResponse updateUser(String id , UpdateUserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

//      Check if user update new email and it has stored in database yet
        if(!user.getEmail().equals(request.getEmail())){
            if(userRepository.existsUsersByEmail(request.getEmail())){
                throw new AppException(ErrorCode.USER_EXISTED);
            }
        }


        if(request.getFile() != null){
            var apiResponse = imageServiceClient.uploadImage(request.getFile(), "profile");
            if (apiResponse != null && apiResponse.getCode() == 100) {
                var image = apiResponse.getData().getUrl();
                user.setProfilePicture(image);
            }
            else{
                throw new AppException(ErrorCode.FAIL_SENDING_EMAIL);
            }
        }
        userMapper.updateUser(user, request);

        //Set Role
        Role role = roleRepository.save(Role.builder()
                .name(request.getRole())
                .build());

        var roles = new HashSet<Role>();
        roles.add(role);
        user.setRoles(roles);

        System.out.println("UPdate success");

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
