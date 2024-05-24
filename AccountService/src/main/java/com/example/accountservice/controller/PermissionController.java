package com.example.accountservice.controller;

import com.example.accountservice.dto.request.PermissionRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.PermissionResponse;
import com.example.accountservice.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController {
    @Autowired
    private PermissionService permissionService;


    @PostMapping
    public ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest req){
        return  ApiResponse.<PermissionResponse>builder()
                .data(permissionService.create(req))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PermissionResponse>> getAll(){
        return ApiResponse.<List<PermissionResponse>>builder()
                .data(permissionService.getAll())
                .build();
    }

    @DeleteMapping("/{permission}")
    public ApiResponse<Void> delete(@PathVariable String permission){
        permissionService.delete(permission);
        return ApiResponse.<Void>builder()
                .build();
    }
}
