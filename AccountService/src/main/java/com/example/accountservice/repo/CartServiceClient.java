package com.example.accountservice.repo;

import com.example.accountservice.config.FeignConfig;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.ImageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "CartService", url = "http://localhost:8086")
public interface CartServiceClient {
    @PostMapping(value = "/cart/create", produces =  MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<Void> createCart(@RequestParam String customerEmail);
}
