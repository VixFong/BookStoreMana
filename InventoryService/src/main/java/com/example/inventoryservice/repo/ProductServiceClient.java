package com.example.inventoryservice.repo;


import com.example.inventoryservice.config.FeignConfig;
import com.example.inventoryservice.dto.response.ApiResponse;
import com.example.inventoryservice.dto.response.SearchInventoryByBookIdResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "ProductService", url = "http://localhost:8083",  configuration = FeignConfig.class)
public interface ProductServiceClient {
    @GetMapping(value = "/products/books/bookIds", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<SearchInventoryByBookIdResponse>> searchIdsBook(@RequestParam String keyword);


}
