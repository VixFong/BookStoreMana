package com.example.accountservice.repo;

import com.example.accountservice.config.FeignConfig;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.ImageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "ImageService", url = "http://localhost:8080", configuration = FeignConfig.class)
public interface ImageServiceClient {
    @PostMapping(value = "/images/upload", produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<ImageResponse> uploadImage(@RequestPart("file") MultipartFile file, @RequestParam("folder") String folder);
}
