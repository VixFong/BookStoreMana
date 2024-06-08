package com.example.productservice.repo.ServiceClient;

import com.example.productservice.config.FeignConfig;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.dto.response.ImageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "ImageService", url = "http://localhost:8080", configuration = FeignConfig.class)
public interface ImageServiceClient {
    @PostMapping(value = "/images/upload", produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<ImageResponse> uploadImage(@RequestPart("file") MultipartFile file, @RequestParam("folder") String folder);
}
