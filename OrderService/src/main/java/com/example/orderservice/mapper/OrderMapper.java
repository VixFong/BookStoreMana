package com.example.orderservice.mapper;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

//    @Mapping(target = "orderItems", source = "orderItems")
    Order toOrder(CreateOrderRequest request);


//    @Mapping(target = "orderItems", source = "orderItems")
    OrderResponse toOrderResponse(Order order);
}
