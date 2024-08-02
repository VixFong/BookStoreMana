package com.example.orderservice.controller;

import com.example.orderservice.dto.request.*;
import com.example.orderservice.dto.response.ApiResponse;
import com.example.orderservice.dto.response.OrderCustomerResponse;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderCustomer;
import com.example.orderservice.service.ExcelExportService;
import com.example.orderservice.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/orders")
@Slf4j
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private ExcelExportService exportService;


    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.create(request))
                .build();
    }

    @PostMapping("/customer")
    public ApiResponse<OrderCustomerResponse> createOrderCustomer(@RequestBody CreateOrderCustomerRequest request) {
        return ApiResponse.<OrderCustomerResponse>builder()
                .data(orderService.createOrderCustomer(request))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<OrderResponse>> searchOrder(
            @RequestParam String keyword,
            @RequestParam String status,
            @RequestParam String timeFilter,
            @RequestParam String dateRange,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .data(orderService.searchOrders(keyword, status, timeFilter, dateRange, page, size))
                .build();
    }

    @GetMapping("/search_cus")
    public ApiResponse<Page<OrderCustomerResponse>> searchOrderCustomer(
            @RequestParam String keyword,
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<Page<OrderCustomerResponse>>builder()
                .data(orderService.searchOrderCustomer(keyword, status, page, size))
                .build();
    }
    @PostMapping("/export")
    public ResponseEntity<byte[]> exportExcel(@RequestBody List<String> ids) throws IOException {
        log.info("Received export request with ids: " + ids);
        ByteArrayInputStream in = exportService.exportOrdersToExcel(ids);
//        try {
//            in = exportService.exportOrdersToExcel(ids);
//        } catch (IOException e) {
//            return ResponseEntity.internalServerError().build();
//        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=orders.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(in.readAllBytes());
    }


    @PostMapping("/import")
    public ApiResponse<Void> importOrdersFromExcel(@RequestParam("file") MultipartFile file) {
        System.out.println("Import");

        exportService.importOrdersFromExcel(file);
        return ApiResponse.<Void>builder()
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable String id){
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.getOrder(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<OrderResponse> edit(@PathVariable String id, @RequestBody UpdateOrderRequest request){
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.edit(id, request))
                .build();
    }

    @PutMapping("edit/status")
    public ApiResponse<Void> updateStatusOrder(@RequestBody List<String> ids){
        orderService.updateStatusOrder(ids);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PutMapping("/edit/customer/status/{id}")
    public ApiResponse<Void> updateStatusOrderCustomer(@PathVariable String id,
                                                       @RequestParam String status,
                                                       @RequestBody List<UpdateStockRequest> request){
        orderService.updateStatusOrderCustomer(id, status, request);

//        System.out.println("Stock " + request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PutMapping("/receiveQty/{id}")
    public ApiResponse<Void> updateReceiveQty(
            @PathVariable String id,
            @RequestBody List<UpdateReceiveQtyRequest> requests) {
        System.out.println("order item");
        orderService.updateReceivedQuantity(id,requests);
        return ApiResponse.<Void>builder().build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        orderService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

//    @PostMapping("/export")
//    public ResponseEntity<ApiResponse<byte[]>> exportExcel(@RequestBody List<String> ids) throws IOException {
////        log.info("Received export request with ids: " + ids);
//
//        ByteArrayInputStream in = exportService.exportOrdersToExcel(ids);
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-Disposition", "attachment; filename=orders.xlsx");
////
//        byte[] fileContent = in.readAllBytes();
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(ApiResponse.<byte[]>builder()
//                        .data(fileContent)
//                        .build());
//
//    }
}
