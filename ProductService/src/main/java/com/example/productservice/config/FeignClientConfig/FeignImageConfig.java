package com.example.productservice.config.FeignClientConfig;

import feign.RequestInterceptor;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Configuration
public class FeignImageConfig {

    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder();
    }

//    @Bean
//    public RequestInterceptor requestTokenBearerInterceptor() {
//        return requestTemplate -> {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            if (authentication instanceof JwtAuthenticationToken) {
//                JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
//                String tokenValue = jwtToken.getToken().getTokenValue();
//                requestTemplate.header("Authorization", "Bearer " + tokenValue);
//            }
//        };
//    }
}