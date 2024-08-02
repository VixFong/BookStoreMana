package com.example.orderservice.mapper;

import com.example.orderservice.dto.request.CreateOrderCustomerRequest;
import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.request.UpdateOrderRequest;
import com.example.orderservice.dto.response.OrderCustomerResponse;
import com.example.orderservice.dto.response.OrderItemResponse;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderCustomer;
import com.example.orderservice.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

//    @Mapping(target = "orderItems", source = "orderItems")
    Order toOrder(CreateOrderRequest request);


    @Mapping(target = "orderItems", source = "orderItems")
    OrderResponse toOrderResponse(Order order);

    OrderCustomer toOrderCustomer(CreateOrderCustomerRequest request);

    @Mapping(target = "orderItems", source = "orderItems")
    OrderCustomerResponse toOrderCustomerResponse(OrderCustomer orderCustomer);
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems);

    @Mapping(target = "orderItems", ignore = true)
    void updateOrder(@MappingTarget Order order, UpdateOrderRequest request);

}
