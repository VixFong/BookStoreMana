package com.example.inventoryservice.controller;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.response.ApiResponse;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public ApiResponse<InventoryResponse> create(@RequestBody CreateInventoryRequest req){
        return  ApiResponse.<InventoryResponse>builder()
                .data(inventoryService.create(req))
                .build();
    }

    @GetMapping
    public ApiResponse<List<InventoryResponse>> getAll(){
        return ApiResponse.<List<InventoryResponse>>builder()
                .data(inventoryService.getAll())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<InventoryResponse> update(@PathVariable String id, @RequestBody UpdateInventoryRequest request){
        return ApiResponse.<InventoryResponse>builder()
                .data(inventoryService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        inventoryService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

}
