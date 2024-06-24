package com.example.productservice.repo.ServiceClient;


import com.example.productservice.config.FeignClientConfig.FeignConfig;
import com.example.productservice.dto.response.ApiResponse;
//import com.example.productservice.dto.response.SearchInventoryByBookIdResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "InventoryService", url = "http://localhost:8082",  configuration = FeignConfig.class)
public interface InventoryServiceClient {
    @DeleteMapping(value = "/inventory/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<String> delete(@PathVariable String id);
}
