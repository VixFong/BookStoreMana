package com.example.publisherservice.controller;

import com.example.publisherservice.dto.request.CreatePublisherRequest;
import com.example.publisherservice.dto.request.UpdatePublisherRequest;
import com.example.publisherservice.dto.response.ApiResponse;
import com.example.publisherservice.dto.response.PublisherResponse;
import com.example.publisherservice.service.PublisherService;
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
