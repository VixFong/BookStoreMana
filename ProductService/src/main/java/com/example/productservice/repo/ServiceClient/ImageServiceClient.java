package com.example.productservice.repo.ServiceClient;

import com.example.productservice.config.FeignClientConfig.FeignConfig;
import com.example.productservice.config.FeignClientConfig.FeignImageConfig;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.dto.response.ImageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "ImageService", url = "http://localhost:8080", configuration = FeignImageConfig.class)
public interface ImageServiceClient {
    @PostMapping(value = "/images/uploads", produces = MediaType.APPLICATION_JSON_VALUE,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<List<ImageResponse>> uploadBookImages(@RequestPart("files") List<MultipartFile> files, @RequestParam("folder") String folder);
}
