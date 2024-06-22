package com.example.productservice.controller;

import com.example.productservice.dto.request.Publisher.CreatePublisherRequest;
import com.example.productservice.dto.request.Publisher.UpdatePublisherRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.dto.response.PublisherResponse;
import com.example.productservice.dto.response.Publisher_InventoryResponse;
import com.example.productservice.service.Publisher.PublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publishers")
public class PublisherController {

    @Autowired
    private PublisherService publisherService;

    @PostMapping
    public ApiResponse<PublisherResponse> create(@RequestBody CreatePublisherRequest req){
        return  ApiResponse.<PublisherResponse>builder()
                .data(publisherService.create(req))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PublisherResponse>> getAll(){
        return ApiResponse.<List<PublisherResponse>>builder()
                .data(publisherService.getAll())
                .build();
    }

    @GetMapping("/publisherData")
    public ApiResponse<List<Publisher_InventoryResponse>> getPublisherData(){
        return ApiResponse.<List<Publisher_InventoryResponse>>builder()
                .data(publisherService.getPublisherName())
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<PublisherResponse> update(@PathVariable String id, @RequestBody UpdatePublisherRequest request){
        return ApiResponse.<PublisherResponse>builder()
                .data(publisherService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        publisherService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

}
