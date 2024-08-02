package com.example.inventoryservice.controller;

import com.example.inventoryservice.dto.request.*;
import com.example.inventoryservice.dto.response.*;
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

    @GetMapping("/search-order")
    public ApiResponse<List<SearchInventory_OrderResponse>> searchInventory_Order(
            @RequestParam String keyword)
             {
        System.out.println(keyword);
        return ApiResponse.<List<SearchInventory_OrderResponse>>builder()
                .data(inventoryService.searchInventory_order(keyword))
                .build();

    }


//    @GetMapping("/stock")
//    public ApiResponse<List<InventoryQuantityResponse>> getQuantity(
//            @RequestParam List<String> bookIds)
//    {
//        System.out.println("stock " + bookIds);
//        return ApiResponse.<List<InventoryQuantityResponse>>builder()
//                .data(inventoryService.getQuantity(bookIds))
//                .build();
//
//    }
    @PostMapping("/stock")
    public ApiResponse<List<InventoryQuantityResponse>> getQuantity(
            @RequestBody ListBookClientRequest request)
    {
        System.out.println("stock " + request);
        return ApiResponse.<List<InventoryQuantityResponse>>builder()
                .data(inventoryService.getQuantity(request.getBookId()))
                .build();

    }

    @PostMapping("status")
    public ApiResponse<List<InventoryStatusResponse>> getBookIdAndStatusByBookIds(@RequestBody List<String> bookIds){
        System.out.println("Status");
        return ApiResponse.<List<InventoryStatusResponse>>builder()
                .data(inventoryService.getBookIdAndStatusByBookIds(bookIds))
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
