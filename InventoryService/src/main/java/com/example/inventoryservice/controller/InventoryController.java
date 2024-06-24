package com.example.inventoryservice.controller;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.SearchInventoryByBookIdRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateReceivedQuantityRequest;
import com.example.inventoryservice.dto.response.ApiResponse;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.model.Inventory;
import com.example.inventoryservice.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    @GetMapping("/inventories")
    public ApiResponse<Page<InventoryResponse>> getAllInventories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<InventoryResponse>>builder()
                .data(inventoryService.getAllInventories(page, size))
                .build();

    }

//    @PostMapping("/search")
//    public ApiResponse<Page<InventoryResponse>> searchInventory(
//            @RequestBody List<SearchInventoryByBookIdRequest> request,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        System.out.println(request.get(0));
//        return ApiResponse.<Page<InventoryResponse>>builder()
//                .data(inventoryService.searchInventory(request, page, size))
//                .build();
//
//    }

    @GetMapping("/search")
    public ApiResponse<Page<InventoryResponse>> searchInventory(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println(keyword);
        return ApiResponse.<Page<InventoryResponse>>builder()
                .data(inventoryService.searchInventory(keyword, page, size))
                .build();

    }

//    @PostMapping("/search")
//    public ApiResponse<Page<InventoryResponse>> searchInventories(@RequestBody List<SearchInventoryByBookIdRequest> request,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//
////        for(SearchInventoryByBookIdRequest i : request){
////
////            System.out.println("Request " + i.getBookId());
////        }
////        inventoryService.SearchInventory(request, page,size);
//        return ApiResponse.<Page<InventoryResponse>>builder()
//                .data(inventoryService.getAllInventories(page, size))
//                .build();
//    }
    @PutMapping("/{id}")
    public ApiResponse<InventoryResponse> update(@PathVariable String id, @RequestBody UpdateInventoryRequest request){
        return ApiResponse.<InventoryResponse>builder()
                .data(inventoryService.update(id, request))
                .build();
    }

//    @PutMapping("/{id}")
//    public ApiResponse<InventoryResponse> updateQuantity(@PathVariable String id, @RequestBody UpdateReceivedQuantityRequest request){
//        return ApiResponse.<InventoryResponse>builder()
//                .data(inventoryService.updateQuantity(id, request))
//                .build();
//    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable String id){
        String annouceDelete = inventoryService.delete(id);
        System.out.println(annouceDelete);
        return ApiResponse.<String>builder()
                .data(annouceDelete)
                .build();
    }

}
