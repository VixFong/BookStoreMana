package com.example.apigateway.config;

import com.example.apigateway.dto.response.ApiResponse;
import com.example.apigateway.service.AccountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.HttpServerResponse;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class AuthFilter implements GlobalFilter, Ordered {
    @Autowired
    private AccountService accountService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String[] publicEndPoint = {"/identity/users/register","/identity/users/","/identity/auth/.*",
                                            "/products/categories", "/products/authors",  "/products/publishers/publisherData", "/products/books/search_client",
                                            "/inventory/stock",
                                            "/cart/create"};

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain){

        if(isPublicEndPoint(exchange.getRequest())){
            return chain.filter(exchange);
        }

//      Get token from auth header
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if(CollectionUtils.isEmpty(authHeader)){
            return unauthenticated(exchange.getResponse());
        }

        String token = authHeader.get(0).replace("Bearer ", "");
        System.out.println("Token From Api" + token);
        return accountService.introspect(token).flatMap(introspectResponseApiResponse -> {
            if(introspectResponseApiResponse.getData().isValid()) {
                System.out.println("Connect to introspect  " + introspectResponseApiResponse.getData().isValid());
                return chain.filter(exchange);
            }
            else {
                System.out.println("It fail ");
                return unauthenticated(exchange.getResponse());
            }
        }).onErrorResume(throwable -> {
            log.error("Error during token introspection", throwable);
            return unauthenticated(exchange.getResponse());
        }); //if have any other errors it will prevent

    }

    @Override
    public int getOrder(){
        return -1;
    }


    private boolean isPublicEndPoint(ServerHttpRequest request){
        return Arrays.stream(publicEndPoint)
                .anyMatch(s -> request.getURI().getPath().matches(s));
    }

    public Mono<Void> unauthenticated(ServerHttpResponse response){
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(401)
                .message("Unauthenticated")
                .build();
        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return response.writeWith(
                Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
