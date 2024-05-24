package com.example.accountservice.controller;

import com.example.accountservice.dto.request.RoleRequest;
import com.example.accountservice.dto.response.ApiResponse;
import com.example.accountservice.dto.response.RoleResponse;
import com.example.accountservice.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;


    @PostMapping
    public ApiResponse<RoleResponse> create(@RequestBody RoleRequest req){
        return  ApiResponse.<RoleResponse>builder()
                .data(roleService.create(req))
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAll(){
        return ApiResponse.<List<RoleResponse>>builder()
                .data(roleService.getAll())
                .build();
    }

    @DeleteMapping("/{permission}")
    public ApiResponse<Void> delete(@PathVariable String role){
        roleService.delete(role);
        return ApiResponse.<Void>builder()
                .build();
    }
}
