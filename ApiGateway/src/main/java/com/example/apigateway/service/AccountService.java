package com.example.apigateway.service;

import com.example.apigateway.dto.request.IntrospectRequest;
import com.example.apigateway.dto.response.ApiResponse;
import com.example.apigateway.dto.response.IntrospectResponse;
import com.example.apigateway.repo.AccountClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service

public class AccountService {
    @Autowired
    private AccountClient accountClient;

    public Mono<ApiResponse<IntrospectResponse>> introspect(String token){


        return accountClient.introspect(
                IntrospectRequest.builder()
                .token(token)
                .build());
    }
}
