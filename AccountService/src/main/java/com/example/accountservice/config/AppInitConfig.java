package com.example.accountservice.config;

import com.example.accountservice.model.Role;
import com.example.accountservice.model.User;
import com.example.accountservice.repo.RoleRepository;
import com.example.accountservice.repo.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.HashSet;

@Configuration
@Slf4j
public class AppInitConfig {

    private static final String ADMIN_NAME = "admin";
    private static final String ADMIN_EMAIL = "khangdogia2002@gmail.com";

    private static final String ADMIN_ROLE = "Admin";
    private static final String ADMIN_PASSWORD = "admin";

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){
        return args -> {
            if(userRepository.findByEmail(ADMIN_EMAIL).isEmpty()){

                Role adminRole = roleRepository.save(Role.builder()
                        .name(ADMIN_ROLE)
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .fullName(ADMIN_NAME)
                        .email(ADMIN_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .activate(true)
                        .isLock(false)
                        .startedDate(new Date())
                        .build();

                userRepository.save(user);
                log.warn("admin account has been created");
            }
        };
    }
}

